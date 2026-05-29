import { NextResponse } from 'next/server'
import { LeadPayloadSchema } from '@/from-cms/schemas/lead'
import { buildAutoReplyEmail, buildOwnerEmail, type SubmissionContext } from '@/lib/contact/email-templates'
import { isMailConfigured, ownerRecipients, sendMail } from '@/lib/contact/mailer'

// Wysyłka maili wymaga środowiska Node (nodemailer), nie Edge.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('cf-connecting-ip') ?? headers.get('x-forwarded-for') ?? ''
  return forwarded.split(',')[0]?.trim() || undefined
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = LeadPayloadSchema.safeParse(body)
  if (!parsed.success) {
    // Honeypot (`company`) lub niepoprawne pola — nie wysyłamy maila.
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 422 })
  }

  if (!isMailConfigured()) {
    console.error('[contact] SMTP not configured — set SMTP_HOST/SMTP_USER/SMTP_PASS env vars')
    return NextResponse.json({ ok: false, error: 'mail_not_configured' }, { status: 503 })
  }

  const data = parsed.data
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
  }

  // 1) Powiadomienie do butiku. Gdy ten mail nie wyjdzie — zgłaszamy błąd maila.
  try {
    const owner = buildOwnerEmail(ctx)
    await sendMail({
      to: ownerRecipients(),
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
      replyTo: data.email,
    })
  } catch (error) {
    console.error('[contact] owner email failed', error)
    return NextResponse.json({ ok: false, error: 'mail_failed' }, { status: 502 })
  }

  // 2) Potwierdzenie dla klienta — best-effort, nie blokuje sukcesu.
  let confirmation = false
  try {
    const auto = buildAutoReplyEmail(ctx)
    await sendMail({ to: data.email, subject: auto.subject, html: auto.html, text: auto.text })
    confirmation = true
  } catch (error) {
    console.warn('[contact] auto-reply failed', error)
  }

  return NextResponse.json({ ok: true, delivery: { email: true, confirmation } })
}
