'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { localeConfig, locales, localeFromPathname, switchLocalePath, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  isTransparent?: boolean
  className?: string
  onChange?: () => void
}

export function LanguageSwitcher({ isTransparent = false, className, onChange }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = localeFromPathname(pathname)

  const handleChange = (value: string) => {
    const nextLocale = value as Locale
    router.push(switchLocalePath(pathname, nextLocale))
    onChange?.()
  }

  return (
    <label className={cn('relative inline-flex items-center', className)}>
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          'h-8 appearance-none border bg-transparent pl-3 pr-7 font-sans text-[10px] font-bold uppercase tracking-[0.22em] outline-none transition-colors',
          isTransparent
            ? 'border-accent-gold/60 text-white hover:border-accent-gold'
            : 'border-accent-gold/60 text-foreground hover:border-accent-gold',
        )}
        aria-label="Language"
      >
        {locales.map((item) => (
          <option key={item} value={item} className="bg-background text-foreground">
            {localeConfig[item].label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-accent-gold"
      />
    </label>
  )
}
