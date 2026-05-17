/**
 * Adapter słownika tłumaczeń UI generowanych przez CMS (auto-translator dla EN/UA).
 *
 * Dziś (mock mode) zwraca pusty słownik — wszystkie statyczne etykiety UI
 * są nadal w `lib/i18n.ts` `ui[locale]`. Po wdrożeniu CMS adapter pobierze
 * bundle z `${CMS_API_URL}/api/v1/translations?locale=...` i nadpisze tylko
 * wpisy które CMS dostarcza (reszta — fallback do hardkodu).
 */

import { LocaleSchema, TranslationBundleSchema, type TranslationBundle, type TranslationLocale } from '../schemas/translation'
import { CMS_MODE, assertLiveConfig } from '../mode'
import fixtures from '../fixtures/translations.json'

const cache = new Map<TranslationLocale, TranslationBundle>()

async function fetchFromCms(locale: TranslationLocale): Promise<TranslationBundle> {
  const { url, token } = assertLiveConfig()
  const res = await fetch(`${url}/api/v1/translations?locale=${locale}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new Error(`[from-cms] translations ${locale}: ${res.status}`)
  }
  const json: unknown = await res.json()
  return TranslationBundleSchema.parse(json)
}

export async function getTranslationBundle(locale: TranslationLocale): Promise<TranslationBundle> {
  LocaleSchema.parse(locale)
  const cached = cache.get(locale)
  if (cached) return cached
  if (CMS_MODE === 'mock') {
    const bundle = TranslationBundleSchema.parse(
      (fixtures as Record<string, TranslationBundle>)[locale] ?? {},
    )
    cache.set(locale, bundle)
    return bundle
  }
  const bundle = await fetchFromCms(locale)
  cache.set(locale, bundle)
  return bundle
}

export async function getTranslation(
  key: string,
  locale: TranslationLocale,
): Promise<string | null> {
  const bundle = await getTranslationBundle(locale)
  return bundle[key] ?? null
}
