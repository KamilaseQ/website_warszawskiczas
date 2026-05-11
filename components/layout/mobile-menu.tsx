'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Phone, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ContactLink } from '@/components/contact-link'
import { ADDRESS, CONTACT_PHONE, CONTACT_PHONE_RAW } from '@/lib/config'
import { canonicalPath, localeFromPathname, localizePath, ui } from '@/lib/i18n'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LanguageSwitcher } from './language-switcher'

interface NavEntry {
  href: string
  label: string
  contactSource?: string
}

function getPrimaryNav(locale: ReturnType<typeof localeFromPathname>): NavEntry[] {
  const t = ui[locale]
  return [
    { href: '/', label: t.home },
    { href: '/produkty', label: t.products },
    { href: '/kolekcja-na-zapytanie', label: t.hiddenCollection },
    { href: '/uslugi/naprawa-i-serwis', label: t.repair },
    { href: '/uslugi/skup', label: t.buyingWatches },
    { href: '/uslugi/komis', label: t.consignment },
    { href: '/butik', label: t.boutique },
    { href: '/kontakt', label: t.contact, contactSource: 'nav-mobile' },
  ]
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const cleanPath = canonicalPath(pathname ?? '/', locale)
  const t = ui[locale]
  const primaryNav = getPrimaryNav(locale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useBodyScrollLock(open)

  if (!mounted) return null

  const menuContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col bg-[#0a0a0a] text-white lg:hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          <div className="relative flex h-20 flex-shrink-0 items-center justify-between border-b border-white/10 px-6">
            <Link
              href={localizePath('/', locale)}
              onClick={onClose}
              className="font-serif text-xl font-medium tracking-wide text-white"
            >
              Warszawski Czas
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher isTransparent onChange={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label={t.closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-accent-gold hover:text-accent-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="relative flex-1 overflow-y-auto px-8 py-10">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.45em] text-accent-gold">
              {t.menu}
            </p>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
              }}
              className="mt-8 space-y-1"
            >
              {primaryNav.map((item) => {
                const isActive = cleanPath === item.href
                const linkClass = cn(
                  'group flex items-baseline justify-between border-b border-white/10 py-4 transition-colors duration-300',
                  isActive ? 'text-accent-gold' : 'text-white hover:text-accent-gold',
                )
                const inner = (
                  <>
                    <span className="font-serif text-3xl font-normal sm:text-4xl">{item.label}</span>
                    <span
                      aria-hidden
                      className={cn(
                        'translate-x-0 font-sans text-[10px] uppercase tracking-[0.3em] transition-all duration-300 group-hover:translate-x-1',
                        isActive ? 'text-accent-gold' : 'text-white/30 group-hover:text-accent-gold',
                      )}
                    >
                      -&gt;
                    </span>
                  </>
                )
                return (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
                    }}
                  >
                    {item.contactSource ? (
                      <ContactLink source={item.contactSource} onClick={onClose} className={linkClass}>
                        {inner}
                      </ContactLink>
                    ) : (
                      <Link href={localizePath(item.href, locale)} onClick={onClose} className={linkClass}>
                        {inner}
                      </Link>
                    )}
                  </motion.li>
                )
              })}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-10"
            >
              <ContactLink
                source="mobile-menu-cta"
                onClick={onClose}
                className="block w-full bg-accent-gold py-4 text-center font-serif text-xs uppercase tracking-[0.3em] text-[#0a0a0a] transition-colors hover:bg-white"
              >
                {t.consult}
              </ContactLink>
            </motion.div>
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="relative border-t border-white/10 px-8 py-6 text-white/60"
          >
            <a
              href={`tel:${CONTACT_PHONE_RAW}`}
              className="flex items-center gap-3 py-2 text-sm transition-colors hover:text-accent-gold"
            >
              <Phone className="h-4 w-4 text-accent-gold" />
              {CONTACT_PHONE}
            </a>
            <p className="flex items-start gap-3 py-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-gold" />
              <span>
                {ADDRESS.street}, {ADDRESS.postal} {ADDRESS.city}
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(menuContent, document.body)
}
