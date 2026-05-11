'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { localeFromPathname, localizePath, ui } from '@/lib/i18n'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.79a8.23 8.23 0 004.76 1.52V6.86a4.84 4.84 0 01-1-.17z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function Footer() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = ui[locale]
  const footerLinks = {
    oferta: [
      { href: '/produkty', label: t.products },
      { href: '/kolekcja-na-zapytanie', label: t.hiddenCollection },
    ],
    uslugi: [
      { href: '/uslugi/naprawa-i-serwis', label: t.repair },
      { href: '/uslugi/skup', label: t.buyingWatches },
      { href: '/uslugi/komis', label: t.consignment },
    ],
    informacje: [
      { href: '/butik', label: t.aboutBoutique },
      { href: '/kontakt', label: t.contact, contactSource: 'nav-footer' as const },
    ],
  }

  return (
    <footer className="relative bg-[#0a0a0a] text-white/90">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href={localizePath('/', locale)} className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                Warszawski Czas
              </span>
            </Link>
            <p className="mt-3 font-serif text-lg tracking-wide text-accent-gold">Mokotowska 71</p>
            <p className="mt-5 whitespace-pre-line font-serif text-base italic leading-snug text-white/80">
              {t.footerTagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/45">{t.footerDescription}</p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com/warszawskiczas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-colors duration-300 hover:text-accent-gold"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com/@warszawskiczas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-colors duration-300 hover:text-accent-gold"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/people/WarszawskiCzas/100064090685061/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-colors duration-300 hover:text-accent-gold"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            <div>
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                {t.offer}
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.oferta.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizePath(link.href, locale)}
                      className="text-sm text-white/60 transition-colors hover:text-accent-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                {t.services}
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.uslugi.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizePath(link.href, locale)}
                      className="text-sm text-white/60 transition-colors hover:text-accent-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                {t.info}
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.informacje.map((link) => (
                  <li key={link.href}>
                    {'contactSource' in link && link.contactSource ? (
                      <ContactLink
                        source={link.contactSource}
                        className="text-sm text-white/60 transition-colors hover:text-accent-gold"
                      >
                        {link.label}
                      </ContactLink>
                    ) : (
                      <Link
                        href={localizePath(link.href, locale)}
                        className="text-sm text-white/60 transition-colors hover:text-accent-gold"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
              {t.contact}
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-gold" />
                <span className="text-sm text-white/60">
                  ul. Mokotowska 71<br />
                  00-530 Warszawa
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-accent-gold" />
                <a href="tel:+48604501000" className="text-sm text-white/60 transition-colors hover:text-accent-gold">
                  +48 604 50 1000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-accent-gold" />
                <a href="mailto:biuro@warszawskiczas.pl" className="text-sm text-white/60 transition-colors hover:text-accent-gold">
                  biuro@warszawskiczas.pl
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-gold" />
                <span className="whitespace-pre-line text-sm text-white/60">{t.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-white/30 sm:text-left">
            &copy; {new Date().getFullYear()} Warszawski Czas
          </p>
          <nav className="flex items-center gap-6">
            <Link
              href={localizePath('/polityka-prywatnosci', locale)}
              className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-accent-gold"
            >
              {t.privacy}
            </Link>
            <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden />
            <Link
              href={localizePath('/regulamin', locale)}
              className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-accent-gold"
            >
              {t.terms}
            </Link>
            <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden />
            <Link
              href={localizePath('/deklaracja-dostepnosci', locale)}
              className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-accent-gold"
            >
              {t.accessibility}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
