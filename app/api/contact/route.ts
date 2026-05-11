import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact/schema'
import { checkRateLimit } from '@/lib/contact/rate-limit'
import { sendMail } from '@/lib/contact/mailer'
import { notifyWhatsApp } from '@/lib/contact/whatsapp'
import {
  buildAutoReplyEmail,
  buildOwnerEmail,
  buildWhatsAppText,
  type SubmissionContext,
} from '@/lib/contact/email-templates'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MIN_FILL_TIME_MS = 2000

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}

export async function POST(req: Request) {
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ ok: false, error: 'invalid content-type' }, { status: 400 })
  }

  const ip = getClientIp(req)
  const userAgent = req.headers.get('user-agent') ?? undefined

  const rl = checkRateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Zbyt wiele zgłoszeń. Spróbuj ponownie za chwilę.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Sprawdź poprawność pól formularza.' }, { status: 400 })
  }

  const data = parsed.data

  if (data.company.length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (Date.now() - data.t < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: false, error: 'Wykryto nieprawidłowe zachowanie formularza.' }, { status: 400 })
  }

  const ctx: SubmissionContext = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    source: data.source,
    product: data.product,
    sessionPath: data.sessionPath,
    referrer: data.referrer,
    ip,
    userAgent,
    submittedAt: new Date(),
  }

  const toEmail = process.env.CONTACT_TO_EMAIL
  if (!toEmail) {
    console.error('[contact] CONTACT_TO_EMAIL not configured')
    return NextResponse.json(
      { ok: false, error: 'Chwilowy problem z wysłaniem. Zadzwoń: +48 604 50 1000.' },
      { status: 500 },
    )
  }

  const owner = buildOwnerEmail(ctx)
  const auto = buildAutoReplyEmail(ctx)

  try {
    await sendMail({
      to: toEmail,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
      replyTo: data.email,
    })
  } catch (err) {
    console.error('[contact] owner mail failed', err)
    return NextResponse.json(
      { ok: false, error: 'Chwilowy problem z wysłaniem. Zadzwoń: +48 604 50 1000.' },
      { status: 500 },
    )
  }

  await Promise.allSettled([
    sendMail({
      to: data.email,
      subject: auto.subject,
      html: auto.html,
      text: auto.text,
    }).catch((err) => console.error('[contact] auto-reply failed', err)),
    notifyWhatsApp(buildWhatsAppText(ctx)).catch((err) => console.error('[contact] whatsapp failed', err)),
  ])

  return NextResponse.json({ ok: true })
}
