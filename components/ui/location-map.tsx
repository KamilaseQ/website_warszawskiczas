'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const MAP_EMBED_URL =
  'https://maps.google.com/maps?cid=11669713150774348709&hl=pl&z=17&t=&output=embed'

interface LocationMapProps {
  className?: string
}

/**
 * Mapa Google ładuje się dopiero gdy element wjedzie blisko viewportu
 * (IntersectionObserver, rootMargin 400 px) — wcześniej DOM nie zawiera
 * iframe-a, więc nie ma żadnych requestów do third-party. Daje to wymierny
 * zysk na LCP i transferze pierwszego ekranu na `/kontakt`.
 */
export function LocationMap({ className }: LocationMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (load) return
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setLoad(true)
      return
    }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true)
          obs.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [load])

  return (
    <div ref={ref} className={cn('relative overflow-hidden bg-[#0f0f0e]', className)}>
      {load ? (
        <iframe
          src={MAP_EMBED_URL}
          width="100%"
          height="100%"
          className="absolute inset-0 h-full w-full bg-[#0f0f0e]"
          style={{
            border: 0,
            filter: 'grayscale(0.85) contrast(1.05) brightness(0.75) sepia(0.25)',
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Warszawski Czas - Mokotowska 71, Warszawa"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-[#0f0f0e]"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/30">
            Mapa · Mokotowska 71
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0a0a0a]/30 via-transparent to-[#c9a962]/[0.04]" />
    </div>
  )
}
