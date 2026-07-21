'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { localeConfig, locales, localeFromPathname, switchLocalePath } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  isTransparent?: boolean
  className?: string
  onChange?: () => void
}

/**
 * Natywne `<details>` zachowuje kompaktowy wygląd dawnego selecta, ale każdy
 * odpowiednik językowy jest prawdziwym linkiem obecnym w HTML bez JavaScriptu.
 */
export function LanguageSwitcher({ isTransparent = false, className, onChange }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)

  return (
    <details className={cn('group relative inline-block', className)}>
      <summary
        className={cn(
          'flex h-8 cursor-pointer list-none items-center gap-2 border bg-transparent pl-3 pr-2 font-sans text-[10px] font-bold uppercase tracking-[0.22em] outline-none transition-colors [&::-webkit-details-marker]:hidden',
          'focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2',
          isTransparent
            ? 'border-accent-gold/60 text-white hover:border-accent-gold focus-visible:ring-offset-black'
            : 'border-accent-gold/60 text-foreground hover:border-accent-gold focus-visible:ring-offset-background',
        )}
        aria-label="Language"
      >
        <span>{localeConfig[locale].label}</span>
        <ChevronDown
          aria-hidden
          className="h-3 w-3 text-accent-gold transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="absolute right-0 z-[250] mt-2 min-w-[76px] border border-border bg-background p-1 shadow-xl">
        {locales.map((item) => {
          const active = item === locale
          return (
            <Link
              key={item}
              href={switchLocalePath(pathname, item)}
              prefetch={false}
              hrefLang={localeConfig[item].hreflang}
              lang={localeConfig[item].htmlLang}
              aria-current={active ? 'page' : undefined}
              onClick={(event) => {
                event.currentTarget.closest('details')?.removeAttribute('open')
                onChange?.()
              }}
              className={cn(
                'block px-3 py-2 text-center font-sans text-[10px] font-bold uppercase tracking-[0.22em] transition-colors',
                active
                  ? 'bg-muted text-accent-gold'
                  : 'text-foreground hover:bg-muted hover:text-accent-gold',
              )}
            >
              {localeConfig[item].label}
            </Link>
          )
        })}
      </div>
    </details>
  )
}
