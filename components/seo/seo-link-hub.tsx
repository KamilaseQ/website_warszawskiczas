import Link from 'next/link'
import type { SeoHubGroup } from '@/lib/related-links'

/**
 * Czysty (bez hooków) hub linków wewnętrznych — działa w komponentach
 * serwerowych i klienckich. Renderuje kolumny prostych linków tekstowych,
 * bez ramek/„boxów”, spójnie z resztą serwisu.
 *
 * `localizeHref` pozwala przełożyć kanoniczny (PL) href na wersję locale
 * (stopka przekazuje `localizePath`; katalog PL używa domyślnej tożsamości).
 */
export function SeoLinkHub({
  groups,
  localizeHref = (href) => href,
  tone = 'light',
}: {
  groups: SeoHubGroup[]
  localizeHref?: (href: string) => string
  tone?: 'light' | 'dark'
}) {
  const headingClass =
    tone === 'dark' ? 'text-white/40' : 'text-muted-foreground/70'
  const linkClass =
    tone === 'dark'
      ? 'text-white/55 hover:text-accent-gold'
      : 'text-muted-foreground hover:text-accent-gold'

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => (
        <div key={group.heading}>
          <h3
            className={`font-sans text-[10px] font-bold uppercase tracking-[0.35em] ${headingClass}`}
          >
            {group.heading}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={localizeHref(link.href)}
                  prefetch={false}
                  className={`text-sm transition-colors ${linkClass}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
