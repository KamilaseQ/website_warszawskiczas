import 'server-only'

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
  // Tolerujemy spacje/wielkość liter, żeby literówka typu "Live" / "live "
  // nie cofała builda po cichu do mock (i nie pokazywała starych fixtures).
  const raw = process.env.CMS_MODE?.trim().toLowerCase()
  if (raw === 'live' || raw === 'mock') return raw
  if (!raw && process.env.NODE_ENV !== 'production') return 'mock'
  throw new Error(
    `[from-cms] Invalid or missing CMS_MODE${raw ? `="${raw}"` : ''}. ` +
      'Production must explicitly use CMS_MODE=live (or CMS_MODE=mock only for a deliberate fixture build).',
  )
}

export const CMS_MODE: CmsMode = readMode()
export const CMS_API_URL: string | undefined = process.env.CMS_API_URL
export const CMS_API_TOKEN: string | undefined = process.env.CMS_API_TOKEN

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
