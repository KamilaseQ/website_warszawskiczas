'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CONTACT_PHONE, CONTACT_PHONE_RAW } from '@/lib/config'

interface StickyProductCtaProps {
  /** ARIA label dla telefonu (lokalizowany). */
  callAriaLabel: string
  /** Widoczny tekst przycisku przed numerem (lokalizowany). */
  callLabel?: string
  /** Krótka linijka budująca pilność nad przyciskiem (FOMO). */
  fomoLabel?: string
}

/**
 * Sticky CTA na mobile dla karty produktu — pojedynczy przycisk dzwoniący
 * bezpośrednio na numer kontaktowy. Maksymalnie niskie tarcie: jedno tapnięcie =
 * połączenie. Kto woli pisać, ma osobny przycisk WhatsApp.
 *
 * Pozycjonowanie: renderowane przez `createPortal` do `document.body`, ŻEBY
 * uciec z drzewa `PageTransition`, którego `motion.div` (framer-motion) nakłada
 * `transform` na wrapper. Transform na przodku tworzy containing block dla
 * `position: fixed`, więc pasek przyklejał się do dołu animowanego kontenera, a
 * nie do viewportu — stąd „podniesiony" pasek niezależnie od chrome przeglądarki.
 * Portal do body omija ten problem.
 *
 * Rezerwę miejsca pod paskiem (żeby nie zasłaniał stopki) daje
 * `body.wc-has-mobile-dock { padding-bottom }` w globals.css. Ta sama klasa
 * podnosi przycisk WhatsApp ponad pasek.
 */
export function StickyProductCta({
  callAriaLabel,
  callLabel = 'Zadzwoń',
  fomoLabel = 'Duża rotacja oferty — zapytaj o ten egzemplarz',
}: StickyProductCtaProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.classList.add('wc-has-mobile-dock')
    return () => {
      document.body.classList.remove('wc-has-mobile-dock')
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-2.5 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur sm:hidden"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
    >
      <p className="mb-2 flex items-center justify-center gap-1.5 whitespace-nowrap font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent-gold"
        />
        <span className="truncate">{fomoLabel}</span>
      </p>
      <a
        href={`tel:${CONTACT_PHONE_RAW}`}
        aria-label={callAriaLabel}
        className="flex h-12 w-full items-center justify-center gap-2 bg-[#0a0a0a] font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-accent-gold transition-colors active:bg-accent-gold active:text-[#0a0a0a]"
      >
        <span aria-hidden="true" className="text-sm">☎</span>
        {callLabel} · {CONTACT_PHONE}
      </a>
    </div>,
    document.body,
  )
}
