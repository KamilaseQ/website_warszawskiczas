import { publicRoutePaths } from '@/lib/i18n'

/**
 * Publiczne trasy dostępne dla użytkownika, ale celowo wyłączone z indeksu.
 *
 * - strona podziękowania nie jest samodzielnym wynikiem wyszukiwania,
 * - regulamin pozostaje nieindeksowalny, dopóki zawiera tekst roboczy.
 *
 * Trasa z tej listy musi mieć `noindex,follow`, self-canonical i nie może
 * pojawić się w sitemapie ani w zestawie hreflang.
 */
export const nonIndexablePublicRoutePaths = [
  '/kontakt/dziekujemy',
  '/regulamin',
] as const

const nonIndexable = new Set<string>(nonIndexablePublicRoutePaths)

export const indexablePublicRoutePaths = publicRoutePaths.filter(
  (path) => !nonIndexable.has(path),
)

export function isPublicRouteIndexable(path: string): boolean {
  return !nonIndexable.has(path)
}
