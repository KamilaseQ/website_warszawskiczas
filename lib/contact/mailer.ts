import nodemailer, { type Transporter } from 'nodemailer'

// Konfiguracja SMTP wyłącznie ze zmiennych środowiskowych (runtime serwera Next).
// Wymagane na Hostingerze: SMTP_HOST, SMTP_USER, SMTP_PASS.
// Opcjonalne: SMTP_PORT (465/587), SMTP_SECURE, CONTACT_FROM_EMAIL, CONTACT_FROM_NAME.

let cached: Transporter | null = null

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && (process.env.SMTP_USER || process.env.CONTACT_FROM_EMAIL) && process.env.SMTP_PASS)
}

function getTransporter(): Transporter {
  if (cached) return cached

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 465)
  const user = process.env.SMTP_USER ?? process.env.CONTACT_FROM_EMAIL
  const pass = process.env.SMTP_PASS
  const secure = (process.env.SMTP_SECURE ?? (port === 465 ? 'true' : 'false')).toLowerCase() !== 'false'

  if (!host || !user || !pass) {
    throw new Error('SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing)')
  }

  cached = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  })
  return cached
}

export interface SendMailInput {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendMail(input: SendMailInput): Promise<void> {
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? process.env.SMTP_USER
  const fromName = process.env.CONTACT_FROM_NAME ?? 'Warszawski Czas'

  await getTransporter().sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  })
}

/** Lista odbiorców powiadomienia do butiku (CONTACT_TO_EMAIL, po przecinku), fallback do nadawcy. */
export function ownerRecipients(): string[] {
  const raw = process.env.CONTACT_TO_EMAIL ?? process.env.SMTP_USER ?? process.env.CONTACT_FROM_EMAIL ?? ''
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}
