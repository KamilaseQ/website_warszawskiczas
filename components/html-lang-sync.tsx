'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { localeConfig, localeFromPathname } from '@/lib/i18n'

/**
 * Synchronizuje `<html lang>` z aktualnym locale w URL.
 *
 * Statyczny eksport nie pozwala renderować root layoutu per locale (nie ma
 * middleware ani headers()), więc SSR oddaje `lang="pl"` z layoutu. Ten
 * komponent po hydracji ustawia poprawną wartość dla EN/UA — dla użytkownika,
 * czytników ekranu i narzędzi a11y. Crawler i tak czyta hreflang z `<head>`,
 * więc to jest dodatek UX, nie SEO.
 */
export function HtmlLangSync() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof document === 'undefined') return
    const locale = localeFromPathname(pathname)
    const next = localeConfig[locale].htmlLang
    if (document.documentElement.lang !== next) {
      document.documentElement.lang = next
    }
  }, [pathname])

  return null
}
