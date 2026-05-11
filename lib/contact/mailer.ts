import nodemailer, { type Transporter } from 'nodemailer'

let cached: Transporter | null = null

function getTransporter(): Transporter {
  if (cached) return cached

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = (process.env.SMTP_SECURE ?? 'true').toLowerCase() !== 'false'

  if (!host || !user || !pass) {
    throw new Error('SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing)')
  }

  cached = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
  return cached
}

export interface SendMailInput {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendMail(input: SendMailInput): Promise<void> {
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? process.env.SMTP_USER
  const fromName = process.env.CONTACT_FROM_NAME ?? 'Warszawski Czas'
  const transporter = getTransporter()

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  })
}
