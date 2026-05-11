import { escapeHtml } from './sanitize'

export interface SubmissionContext {
  name: string
  email: string
  phone: string
  message: string
  source?: string
  product?: string
  sessionPath?: string[]
  referrer?: string
  ip?: string
  userAgent?: string
  submittedAt: Date
}

const GOLD = '#b89968'
const DARK = '#0a0a0a'

function formatDate(d: Date): string {
  return d.toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-size:14px;">${value}</td>
  </tr>`
}

export function buildOwnerEmail(ctx: SubmissionContext): { subject: string; html: string; text: string } {
  const ctxRows: string[] = []
  if (ctx.source) ctxRows.push(row('Źródło kliknięcia', escapeHtml(ctx.source)))
  if (ctx.product) ctxRows.push(row('Produkt', escapeHtml(ctx.product)))
  if (ctx.sessionPath && ctx.sessionPath.length > 0) {
    ctxRows.push(row('Ścieżka po stronie', ctx.sessionPath.map((p) => escapeHtml(p)).join(' → ')))
  }
  if (ctx.referrer) ctxRows.push(row('Referrer zewnętrzny', escapeHtml(ctx.referrer)))
  if (ctx.ip) ctxRows.push(row('IP', escapeHtml(ctx.ip)))
  if (ctx.userAgent) ctxRows.push(row('User-Agent', escapeHtml(ctx.userAgent)))
  ctxRows.push(row('Wysłano', escapeHtml(formatDate(ctx.submittedAt))))

  const html = `<!doctype html>
<html lang="pl"><body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
    <div style="background:${DARK};color:#fff;padding:24px 28px;">
      <div style="font-size:11px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;">Warszawski Czas</div>
      <div style="font-size:22px;margin-top:8px;font-style:italic;">Nowe zgłoszenie z formularza</div>
    </div>
    <div style="background:#fff;padding:24px 28px;">
      <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
        ${row('Imię i nazwisko', escapeHtml(ctx.name))}
        ${row('E-mail', `<a href="mailto:${escapeHtml(ctx.email)}" style="color:${GOLD};text-decoration:none;">${escapeHtml(ctx.email)}</a>`)}
        ${row('Telefon', `<a href="tel:${escapeHtml(ctx.phone.replace(/\s/g, ''))}" style="color:${GOLD};text-decoration:none;">${escapeHtml(ctx.phone)}</a>`)}
      </table>
      <div style="margin:24px 0 8px;font-size:11px;letter-spacing:2px;color:#666;text-transform:uppercase;">Wiadomość</div>
      <div style="background:#fafaf9;border-left:3px solid ${GOLD};padding:16px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(ctx.message)}</div>
      <div style="margin:28px 0 8px;font-size:11px;letter-spacing:2px;color:#666;text-transform:uppercase;">Kontekst zgłoszenia</div>
      <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border-top:1px solid #eee;">
        ${ctxRows.join('')}
      </table>
    </div>
    <div style="text-align:center;padding:16px;color:#999;font-size:11px;">Formularz na warszawskiczas.pl</div>
  </div>
</body></html>`

  const text =
    `Nowe zgłoszenie — Warszawski Czas\n\n` +
    `Imię i nazwisko: ${ctx.name}\n` +
    `E-mail: ${ctx.email}\n` +
    `Telefon: ${ctx.phone}\n\n` +
    `Wiadomość:\n${ctx.message}\n\n` +
    `--- Kontekst ---\n` +
    (ctx.source ? `Źródło: ${ctx.source}\n` : '') +
    (ctx.product ? `Produkt: ${ctx.product}\n` : '') +
    (ctx.sessionPath?.length ? `Ścieżka: ${ctx.sessionPath.join(' → ')}\n` : '') +
    (ctx.referrer ? `Referrer: ${ctx.referrer}\n` : '') +
    (ctx.ip ? `IP: ${ctx.ip}\n` : '') +
    (ctx.userAgent ? `User-Agent: ${ctx.userAgent}\n` : '') +
    `Wysłano: ${formatDate(ctx.submittedAt)}\n`

  return {
    subject: `Nowe zgłoszenie — ${ctx.name}${ctx.product ? ` (${ctx.product})` : ''}`,
    html,
    text,
  }
}

export function buildAutoReplyEmail(ctx: SubmissionContext): { subject: string; html: string; text: string } {
  const html = `<!doctype html>
<html lang="pl"><body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:${DARK};color:#fff;padding:32px 28px;text-align:center;">
      <div style="font-size:11px;letter-spacing:4px;color:${GOLD};text-transform:uppercase;">Warszawski Czas</div>
      <div style="font-size:24px;margin-top:12px;font-style:italic;">Dziękujemy za wiadomość</div>
      <div style="margin:16px auto 0;height:1px;width:48px;background:${GOLD};opacity:0.6;"></div>
    </div>
    <div style="background:#fff;padding:32px 28px;font-size:15px;line-height:1.7;color:#222;">
      <p style="margin:0 0 16px;">Witaj ${escapeHtml(ctx.name.split(' ')[0] ?? ctx.name)},</p>
      <p style="margin:0 0 16px;">Dziękujemy za kontakt z <strong>Warszawski Czas</strong>. Otrzymaliśmy Twoją wiadomość i odezwiemy się najszybciej, jak to możliwe — zwykle w ciągu 24 godzin w dni robocze.</p>
      <p style="margin:0 0 16px;">W sprawach pilnych jesteśmy do Państwa dyspozycji telefonicznie:</p>
      <p style="margin:0 0 24px;">
        <a href="tel:+48604501000" style="display:inline-block;padding:12px 20px;background:${GOLD};color:#fff;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">+48 604 50 1000</a>
      </p>
      <div style="margin:24px 0;padding:16px;background:#fafaf9;border-left:3px solid ${GOLD};font-size:13px;color:#555;">
        <div style="font-size:10px;letter-spacing:2px;color:#999;text-transform:uppercase;margin-bottom:8px;">Treść Twojej wiadomości</div>
        <div style="white-space:pre-wrap;">${escapeHtml(ctx.message)}</div>
      </div>
      <p style="margin:24px 0 0;color:#666;font-size:13px;">Z poważaniem,<br/>Zespół Warszawski Czas</p>
    </div>
    <div style="text-align:center;padding:16px;color:#999;font-size:11px;">
      Ta wiadomość została wygenerowana automatycznie w odpowiedzi na zgłoszenie z formularza kontaktowego.
    </div>
  </div>
</body></html>`

  const text =
    `Witaj ${ctx.name.split(' ')[0] ?? ctx.name},\n\n` +
    `Dziękujemy za kontakt z Warszawski Czas. Otrzymaliśmy Twoją wiadomość i odezwiemy się najszybciej, jak to możliwe — zwykle w ciągu 24 godzin w dni robocze.\n\n` +
    `W sprawach pilnych zapraszamy do kontaktu telefonicznego: +48 604 50 1000\n\n` +
    `--- Treść Twojej wiadomości ---\n${ctx.message}\n\n` +
    `Z poważaniem,\nZespół Warszawski Czas`

  return {
    subject: 'Dziękujemy za wiadomość — Warszawski Czas',
    html,
    text,
  }
}

export function buildWhatsAppText(ctx: SubmissionContext): string {
  const lines: string[] = [
    '🔔 Nowe zgłoszenie — Warszawski Czas',
    '',
    `👤 ${ctx.name}`,
    `📧 ${ctx.email}`,
    `📞 ${ctx.phone}`,
  ]
  if (ctx.source) lines.push(`📍 Źródło: ${ctx.source}`)
  if (ctx.product) lines.push(`⌚ Produkt: ${ctx.product}`)
  lines.push('', '💬 Wiadomość:', ctx.message.length > 400 ? ctx.message.slice(0, 400) + '…' : ctx.message)
  return lines.join('\n')
}
