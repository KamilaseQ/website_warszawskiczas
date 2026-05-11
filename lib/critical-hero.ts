import { canonicalPath, localeFromPathname } from '@/lib/i18n'

export const CRITICAL_HERO_READY_EVENT = 'wc-critical-hero-ready'

const CRITICAL_HERO_BY_ROUTE: Record<string, string> = {
  '/butik': '/butikmain.jpg',
  '/kolekcja-na-zapytanie': '/watch-31.jpg',
}

declare global {
  interface Window {
    __wcCriticalHeroReady?: Partial<Record<string, true>>
  }
}

function normalizeSrc(src: string) {
  if (typeof window === 'undefined') return src
  return new URL(src, window.location.origin).href
}

function criticalRouteForPathname(pathname: string | null | undefined) {
  const locale = localeFromPathname(pathname)
  return canonicalPath(pathname ?? '/', locale)
}

export function criticalHeroImageForPathname(pathname: string | null | undefined) {
  return CRITICAL_HERO_BY_ROUTE[criticalRouteForPathname(pathname)] ?? null
}

export function markCriticalHeroReady(src: string) {
  if (typeof window === 'undefined') return
  const key = normalizeSrc(src)
  window.__wcCriticalHeroReady ??= {}
  window.__wcCriticalHeroReady[key] = true
  window.dispatchEvent(
    new CustomEvent(CRITICAL_HERO_READY_EVENT, {
      detail: { src: key },
    }),
  )
}

export function isCriticalHeroReady(src: string) {
  if (typeof window === 'undefined') return false
  return window.__wcCriticalHeroReady?.[normalizeSrc(src)] === true
}
