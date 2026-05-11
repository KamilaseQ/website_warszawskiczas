'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { canonicalPath, localeFromPathname, localizePath, ui } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './language-switcher'
import { MobileMenu } from './mobile-menu'
import { Navigation } from './navigation'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = ui[locale]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = canonicalPath(pathname ?? '/', locale) === '/'
  const isSolid = isScrolled || !isHome

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full border-b transition-all duration-500 ease-in-out',
          isSolid
            ? 'border-border/50 bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80'
            : 'border-transparent bg-transparent text-white',
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href={localizePath('/', locale)} className="flex items-center gap-3">
            <span
              className={cn(
                'font-serif text-xl font-medium tracking-wide transition-colors duration-500 ease-in-out lg:text-xl',
                isSolid ? 'text-foreground' : 'text-white',
              )}
            >
              Warszawski Czas
            </span>
          </Link>

          <Navigation className="hidden lg:flex" isTransparent={!isSolid} />

          <div className="hidden items-center gap-5 lg:flex">
            <LanguageSwitcher isTransparent={!isSolid} />
            <a
              href="tel:+48604501000"
              className={cn(
                'group hidden items-center gap-2 text-[11px] font-normal uppercase tracking-[0.18em] transition-colors duration-500 ease-in-out xl:flex',
                isSolid ? 'text-muted-foreground hover:text-accent-gold' : 'text-white/70 hover:text-white',
              )}
            >
              <Phone className="h-3.5 w-3.5 text-accent-gold transition-colors duration-500 ease-in-out" />
              +48 604 50 1000
            </a>
            <ContactLink
              source="nav-header"
              className={cn(
                'inline-block px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 ease-in-out',
                !isSolid
                  ? 'bg-accent-gold text-[#0a0a0a] hover:bg-white'
                  : 'bg-foreground text-background hover:bg-accent-gold hover:text-foreground',
              )}
            >
              {t.consult}
            </ContactLink>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher isTransparent={!isSolid} />
            <button
              type="button"
              className="relative z-[60] inline-flex h-8 w-8 flex-col items-center justify-center gap-1.5 p-2"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setMobileMenuOpen((prev) => !prev)
              }}
              aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={cn(
                  'block h-px w-5 origin-center transition-all duration-300 ease-in-out',
                  isSolid ? 'bg-foreground' : 'bg-white',
                )}
              />
              <span
                className={cn(
                  'block h-px w-3.5 transition-all duration-300 ease-in-out',
                  isSolid ? 'bg-foreground' : 'bg-white',
                )}
              />
              <span
                className={cn(
                  'block h-px w-5 origin-center transition-all duration-300 ease-in-out',
                  isSolid ? 'bg-foreground' : 'bg-white',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
