import { z } from 'zod'

/**
 * Tłumaczenia etykiet UI generowane przez CMS dla EN/UA (przez auto-translator).
 *
 * Strona pobiera słownik per locale przy buildzie.
 * W mock mode zwracane jest `null` lub klucz dosłowny (placeholder), bo nie ma
 * jeszcze CMSa z tłumaczeniami — wszystkie statyczne etykiety dziś
 * są hardkodowane w `lib/i18n.ts` `ui[locale]`.
 */

export const LocaleSchema = z.enum(['pl', 'en', 'ua'])
export type TranslationLocale = z.infer<typeof LocaleSchema>

export const TranslationEntrySchema = z.object({
  key: z.string().min(1),
  locale: LocaleSchema,
  value: z.string(),
  /** `'auto'` = surowe wyjście z translatora, `'reviewed'` = przejrzane przez admina, `'manual'` = ręczne. */
  status: z.enum(['auto', 'reviewed', 'manual']).optional(),
})

export type TranslationEntry = z.infer<typeof TranslationEntrySchema>

export const TranslationBundleSchema = z.record(z.string(), z.string())
export type TranslationBundle = z.infer<typeof TranslationBundleSchema>
