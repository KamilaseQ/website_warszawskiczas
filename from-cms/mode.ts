/**
 * Przełącznik źródła danych CMS.
 *
 * `mock` (default) — adaptery czytają z `from-cms/fixtures/*.json`.
 *   Tryb używany dziś, dopóki własny CMS nie jest gotowy.
 *
 * `live` — adaptery wykonują fetch z `CMS_API_URL` z nagłówkiem `Authorization: Bearer ${CMS_API_TOKEN}`.
 *   Włącz, gdy CMS będzie zdeployowany pod stabilnym URL-em.
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
