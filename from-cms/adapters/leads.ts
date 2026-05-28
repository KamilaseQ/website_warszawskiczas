/**
 * Adapter wysyłki leadów do CMS.
 *
 * - jeśli `NEXT_PUBLIC_CMS_LEAD_URL` jest ustawiony → POST na ten URL
 *   (przeglądarka, statyczny eksport — leady wychodzą bezpośrednio do CMS-a
 *   przez publiczny endpoint, zabezpieczony CORS-em + rate-limitem)
 * - jeśli nie → log do konsoli + symulacja opóźnienia (mock dev)
 *
 * Walidacja zod po stronie klienta jako pierwsza linia obrony przed śmieciem;
 * CMS musi walidować ten sam schemat po stronie serwera.
 */

import { LeadPayloadSchema, LeadResponseSchema, type LeadPayload, type LeadResponse } from '../schemas/lead'
import { PUBLIC_LEAD_URL } from '../mode'

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const parsed = LeadPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return { ok: false, error: 'Sprawdź poprawność pól formularza.' }
  }

  if (!PUBLIC_LEAD_URL) {
    if (typeof console !== 'undefined') {
      console.info('[from-cms:mock-lead]', parsed.data)
    }
    await new Promise((r) => setTimeout(r, 400))
    return { ok: true }
  }

  try {
    const res = await fetch(PUBLIC_LEAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    })
    const json: unknown = await res.json().catch(() => ({ ok: res.ok }))
    const validated = LeadResponseSchema.safeParse(json)
    if (!res.ok || !validated.success || !validated.data.ok) {
      return {
        ok: false,
        error:
          (validated.success ? validated.data.error : undefined) ??
          'Chwilowy problem z wysłaniem. Zadzwoń: +48 604 312 411.',
      }
    }
    return validated.data
  } catch {
    return {
      ok: false,
      error: 'Chwilowy problem z wysłaniem. Zadzwoń: +48 604 312 411.',
    }
  }
}
