/**
 * Wysyłka zgłoszenia z formularza. Dwa niezależne kanały:
 *
 *  1. MAIL  → `POST /api/contact` (serwerowy route strony, nodemailer + SMTP ze
 *     zmiennych środowiskowych). Wysyła powiadomienie do butiku, a po jego
 *     sukcesie automatyczne potwierdzenie do klienta.
 *  2. APP   → `POST PUBLIC_LEAD_URL` (aplikacja CMS na Cloudflare): zapis leada
 *     w bazie + powiadomienie WhatsApp.
 *
 * Kolejność: najpierw mail, potem aplikacja/WhatsApp.
 * Wynik: jeśli zadziała chociaż jeden kanał → sukces (pokazujemy podziękowanie).
 * Jeśli nie zadziała żaden → błąd „zadzwoń”.
 *
 * Walidacja zod po stronie klienta to pierwsza linia obrony; serwer (route + CMS)
 * waliduje ten sam schemat ponownie.
 */

import { LeadPayloadSchema, LeadResponseSchema, type LeadPayload, type LeadResponse } from '../schemas/lead'
import { PUBLIC_LEAD_URL } from '../mode'

const CONTACT_ENDPOINT = '/api/contact'

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const parsed = LeadPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return { ok: false, error: 'Sprawdź poprawność pól formularza.' }
  }

  // 1) Mail najpierw.
  const emailOk = await postOk(CONTACT_ENDPOINT, parsed.data)
  // 2) Potem lead + WhatsApp w aplikacji.
  const appOk = PUBLIC_LEAD_URL ? await postOk(PUBLIC_LEAD_URL, parsed.data) : false

  if (emailOk || appOk) {
    return { ok: true, delivery: { email: emailOk, lead: appOk, whatsapp: appOk } }
  }

  // Lokalny dev bez skonfigurowanego backendu — nie blokuj pracy nad UI.
  if (!PUBLIC_LEAD_URL && isLocalMockAllowed()) {
    if (typeof console !== 'undefined') console.info('[from-cms:mock-lead]', parsed.data)
    return { ok: true }
  }

  return {
    ok: false,
    error: 'Nie udało się wysłać formularza. Zadzwoń: +48 604 312 411.',
  }
}

/** POST JSON; true tylko gdy HTTP ok i `{ ok: true }` w odpowiedzi. Każdy błąd → false. */
async function postOk(url: string, data: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json: unknown = await res.json().catch(() => null)
    const validated = LeadResponseSchema.safeParse(json)
    return res.ok && validated.success && validated.data.ok
  } catch {
    return false
  }
}

function isLocalMockAllowed(): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  if (typeof window === 'undefined') return false

  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}
