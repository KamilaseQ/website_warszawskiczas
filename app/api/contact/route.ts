import { NextResponse } from 'next/server'
import {
  LeadPayloadSchema,
  MAX_LEAD_ATTACHMENTS_TOTAL_BYTES,
  type LeadAttachment,
} from '@/from-cms/schemas/lead'
import { buildAutoReplyEmail, buildOwnerEmail, type SubmissionContext } from '@/lib/contact/email-templates'
import { isMailConfigured, ownerRecipients, sendMail, type MailAttachment } from '@/lib/contact/mailer'

// Wysyłka maili wymaga środowiska Node (nodemailer), nie Edge.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Górna granica ciała żądania. Zgłoszenie bez zdjęć to kilka kB; ze zdjęciami —
 * base64 z limitu kontraktu (4 MB binarnie ≈ 5,4 MB base64) plus narzut JSON-a.
 * Odrzucamy większe PRZED `request.json()`, żeby bot nie zmusił serwera do
 * buforowania dowolnie dużego payloadu.
 */
const MAX_REQUEST_BYTES = Math.ceil((MAX_LEAD_ATTACHMENTS_TOTAL_BYTES * 4) / 3) + 256 * 1024

function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('cf-connecting-ip') ?? headers.get('x-forwarded-for') ?? ''
  return forwarded.split(',')[0]?.trim() || undefined
}

/** base64 -> załączniki nodemailera. Nazwa pliku jest czyszczona: idzie w nagłówek MIME. */
function toMailAttachments(attachments: LeadAttachment[] | undefined): MailAttachment[] {
  if (!attachments?.length) return []
  return attachments.map((attachment, index) => ({
    filename: safeFilename(attachment.name, index),
    content: Buffer.from(attachment.data, 'base64'),
    contentType: attachment.type,
  }))
}

function safeFilename(name: string, index: number): string {
  const cleaned = name.replace(/[\r\n"\\/:*?<>|]/g, '').trim()
  return cleaned || `zdjecie-${index + 1}`
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = LeadPayloadSchema.safeParse(body)
  if (!parsed.success) {
    // Honeypot (`company`), zły format pól albo za duże zdjęcia — nie wysyłamy maila.
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 })
  }

  if (!isMailConfigured()) {
    console.error('[contact] SMTP not configured — set SMTP_HOST/SMTP_USER/SMTP_PASS env vars')
    return NextResponse.json({ ok: false, error: 'mail_not_configured' }, { status: 503 })
  }

  const data = parsed.data
  const mailAttachments = toMailAttachments(data.attachments)
  const ctx: SubmissionContext = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    source: data.source,
    product: data.product,
    sessionPath: data.sessionPath,
    referrer: data.referrer,
    ip: clientIp(request.headers),
    userAgent: request.headers.get('user-agent') ?? undefined,
    submittedAt: new Date(),
    attachmentNames: mailAttachments.map((attachment) => attachment.filename),
  }

  // 1) Powiadomienie do butiku. Gdy ten mail nie wyjdzie — zgłaszamy błąd maila.
  //    Zdjęcia potrafią odbić się o limit rozmiaru wiadomości po stronie SMTP,
  //    więc po nieudanej próbie z załącznikami ponawiamy BEZ nich: sama treść
  //    zgłoszenia jest ważniejsza niż zdjęcia (te są też w aplikacji CMS).
  const owner = buildOwnerEmail(ctx)
  let attachmentsDelivered = mailAttachments.length > 0
  try {
    await sendMail({
      to: ownerRecipients(),
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
      replyTo: data.email,
      attachments: mailAttachments,
    })
  } catch (error) {
    if (mailAttachments.length === 0) {
      console.error('[contact] owner email failed', error)
      return NextResponse.json({ ok: false, error: 'mail_failed' }, { status: 502 })
    }

    console.warn('[contact] owner email with attachments failed, retrying without them', error)
    attachmentsDelivered = false
    const fallback = buildOwnerEmail({ ...ctx, attachmentNames: undefined })
    try {
      await sendMail({
        to: ownerRecipients(),
        subject: fallback.subject,
        html: fallback.html,
        text: fallback.text,
        replyTo: data.email,
      })
    } catch (retryError) {
      console.error('[contact] owner email failed', retryError)
      return NextResponse.json({ ok: false, error: 'mail_failed' }, { status: 502 })
    }
  }

  // 2) Potwierdzenie dla klienta — best-effort, nie blokuje sukcesu.
  //    Bez załączników: klient ma te zdjęcia u siebie, a lekki mail dochodzi pewniej.
  let confirmation = false
  try {
    const auto = buildAutoReplyEmail(ctx)
    await sendMail({ to: data.email, subject: auto.subject, html: auto.html, text: auto.text })
    confirmation = true
  } catch (error) {
    console.warn('[contact] auto-reply failed', error)
  }

  return NextResponse.json({
    ok: true,
    delivery: { email: true, confirmation, attachments: attachmentsDelivered },
  })
}
