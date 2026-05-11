'use client'

import { cn } from '@/lib/utils'

const MAP_EMBED_URL =
  'https://maps.google.com/maps?cid=11669713150774348709&hl=pl&z=17&t=&output=embed'

interface LocationMapProps {
  className?: string
}

export function LocationMap({ className }: LocationMapProps) {
  return (
    <div className={cn('relative overflow-hidden bg-[#0f0f0e]', className)}>
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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0a0a0a]/30 via-transparent to-[#c9a962]/[0.04]" />
    </div>
  )
}
