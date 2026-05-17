/**
 * Adapter wysyłki leadów do CMS.
 *
 * - mock mode → log do konsoli (browser/serwer) + symulacja opóźnienia sieci.
 *   Strona działa, formularze "wysyłają się" lokalnie, ale lead nigdzie nie leci.
 * - live mode → POST na `${CMS_API_URL}/api/v1/leads`.
 *
 * Walidacja zod po stronie klienta jako pierwsza linia obrony przed śmieciem;
 * CMS musi walidować ten sam schemat po stronie serwera.
 */

import { LeadPayloadSchema, LeadResponseSchema, type LeadPayload, type LeadResponse } from '../schemas/lead'
import { CMS_MODE, CMS_API_URL } from '../mode'

export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  const parsed = LeadPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return { ok: false, error: 'Sprawdź poprawność pól formularza.' }
  }

  if (CMS_MODE === 'mock') {
    if (typeof console !== 'undefined') {
      console.info('[from-cms:mock-lead]', parsed.data)
    }
    await new Promise((r) => setTimeout(r, 400))
    return { ok: true }
  }

  if (!CMS_API_URL) {
    return {
      ok: false,
      error: 'Chwilowy problem z wysłaniem. Zadzwoń: +48 604 50 1000.',
    }
  }

  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/leads`, {
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
          'Chwilowy problem z wysłaniem. Zadzwoń: +48 604 50 1000.',
      }
    }
    return validated.data
  } catch {
    return {
      ok: false,
      error: 'Chwilowy problem z wysłaniem. Zadzwoń: +48 604 50 1000.',
    }
  }
}
