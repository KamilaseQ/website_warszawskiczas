/**
 * Przełącznik źródła danych CMS.
 *
 * Build-time (Node.js, SSG):
 *  - `CMS_MODE` (`mock` | `live`) decyduje skąd `getAllProducts()` bierze dane
 *  - `CMS_API_URL` + `CMS_API_TOKEN` są SEKRETNE (build-time only)
 *
 * Runtime (przeglądarka):
 *  - leady wysyłają się przez `NEXT_PUBLIC_CMS_LEAD_URL` (publiczny endpoint,
 *    zabezpieczony CORS-em + rate-limitem po stronie CMS)
 *  - działa niezależnie od `CMS_MODE`, więc produkty mogą zostać z fixtures,
 *    a formularze mogą już trafiać do CMS-a
 *  - bez tej zmiennej formularze wracają do trybu mock (`console.info`)
 *  - sekretny token CMS-a NIE może trafić do bundle'a klienckiego
 *
 * Przełącznik jest read-only po inicjalizacji procesu — nie zmieniaj w runtime.
 */

export type CmsMode = 'mock' | 'live'

function readMode(): CmsMode {
  const raw = process.env.CMS_MODE
  if (raw === 'live' || raw === 'mock') return raw
  return 'mock'
}

export const CMS_MODE: CmsMode = readMode()
export const CMS_API_URL: string | undefined = process.env.CMS_API_URL
export const CMS_API_TOKEN: string | undefined = process.env.CMS_API_TOKEN

const DEFAULT_PUBLIC_LEAD_URL = 'https://api.camalio.pl/api/v1/leads'

/**
 * Publiczny URL endpointu leadów — dostępny w przeglądarce.
 * W produkcyjnym buildzie domyślnie wskazuje na CMS API.
 * Pusty / undefined w lokalnym dev → formularze logują do konsoli (mock).
 */
export const PUBLIC_LEAD_URL: string | undefined = readPublicLeadUrl()

function readPublicLeadUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_CMS_LEAD_URL?.trim()
  if (configured) return normalizePublicLeadUrl(configured)

  return process.env.NODE_ENV === 'production' ? DEFAULT_PUBLIC_LEAD_URL : undefined
}

function normalizePublicLeadUrl(value: string): string {
  try {
    const url = new URL(value)
    if (url.hostname.toLowerCase() === 'api.camalio.pl' && url.pathname.toLowerCase() === '/api/v1/leads') {
      url.protocol = 'https:'
      url.hostname = 'api.camalio.pl'
      url.pathname = '/api/v1/leads'
      return url.toString()
    }
  } catch {
    // Fall through and let fetch/reporting handle an invalid custom URL.
  }

  return value
}

/** Wspólny helper rzucający czytelny błąd, gdy live-mode bez pełnej konfiguracji. */
export function assertLiveConfig(): { url: string; token: string } {
  if (!CMS_API_URL) {
    throw new Error('[from-cms] CMS_MODE=live but CMS_API_URL is not set')
  }
  if (!CMS_API_TOKEN) {
    throw new Error('[from-cms] CMS_MODE=live but CMS_API_TOKEN is not set')
  }
  return { url: CMS_API_URL, token: CMS_API_TOKEN }
}
