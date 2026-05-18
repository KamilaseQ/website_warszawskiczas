'use client'

import { useEffect } from 'react'
import { ContactLink } from '@/components/contact-link'
import { Button } from '@/components/ui'
import { CONTACT_PHONE_RAW } from '@/lib/config'

interface StickyProductCtaProps {
  /** ARIA label dla telefonu (lokalizowany). */
  callAriaLabel: string
  /** Tekst głównego CTA — np. „Zapytaj o dostępność". */
  ctaLabel: string
  /** Source UTM-owy dla głównego CTA. */
  ctaSource: string
  /** Nazwa produktu do kontekstu w mailu / CMS. */
  productLabel: string
}

/**
 * Sticky CTA na mobile dla karty produktu.
 *
 * Pozycjonowanie: `position: fixed; bottom: 0` — w iOS Safari/Chrome
 * przyklejone do dolnej krawędzi VISUAL viewportu. Gdy chrome przeglądarki
 * się chowa przy scrollu, fixed-element zjeżdża w dół razem z viewportem.
 * `env(safe-area-inset-bottom)` dodaje padding pod home indicator iPhone-a.
 *
 * Komunikacja z WhatsApp button: klasa `wc-has-mobile-dock` na <body>
 * podnosi WA powyżej tego paska. Pozostałe strony bez sticky CTA dostają
 * WA w domyślnej pozycji.
 */
export function StickyProductCta({
  callAriaLabel,
  ctaLabel,
  ctaSource,
  productLabel,
}: StickyProductCtaProps) {
  useEffect(() => {
    document.body.classList.add('wc-has-mobile-dock')
    return () => {
      document.body.classList.remove('wc-has-mobile-dock')
    }
  }, [])

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur sm:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <ContactLink source={`${ctaSource}-sticky`} product={productLabel}>
              {ctaLabel}
            </ContactLink>
          </Button>
          <a
            href={`tel:${CONTACT_PHONE_RAW}`}
            aria-label={callAriaLabel}
            className="inline-flex h-10 min-w-10 items-center justify-center border border-border px-3 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold"
          >
            ☎
          </a>
        </div>
      </div>
      {/* Spacer pod treścią, żeby ostatnia sekcja nie chowała się pod paskiem.
          Wysokość ~ wysokość paska CTA + bezpieczna ramka. */}
      <div aria-hidden="true" className="h-20 sm:hidden" />
    </>
  )
}
