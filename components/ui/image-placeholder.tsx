import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  className?: string
  label?: string
  variant?: 'light' | 'dark'
  ratio?: string
  showDial?: boolean
}

// Uniwersalny placeholder dla zdjęć — ciemny/jasny gradient z delikatną tarczą i podpisem.
// Zastępowany później prawdziwym next/image bez zmiany layoutu.
export function ImagePlaceholder({
  className,
  label = 'Zdjęcie wkrótce',
  variant = 'light',
  showDial = true,
}: ImagePlaceholderProps) {
  const isDark = variant === 'dark'
  return (
    <div className={cn('relative overflow-hidden', className)} aria-hidden="true">
      <div
        className={cn(
          'absolute inset-0',
          isDark
            ? 'bg-gradient-to-br from-[#181510] via-[#0f0d09] to-[#08070a]'
            : 'bg-gradient-to-br from-[hsl(40,15%,94%)] via-[hsl(36,12%,88%)] to-[hsl(34,10%,80%)]'
        )}
      />

      {/* subtle grain */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }}
      />

      {showDial && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 80 80"
            className={cn(
              'h-[38%] w-auto transition-transform duration-700',
              isDark ? 'opacity-[0.09]' : 'opacity-[0.1]'
            )}
            fill="none"
            stroke={isDark ? '#c9a962' : '#2a2a26'}
            strokeWidth="0.6"
          >
            <circle cx="40" cy="40" r="36" />
            <circle cx="40" cy="40" r="30" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180
              const r1 = 36
              const r2 = deg % 90 === 0 ? 30 : 33
              const x1 = +(40 + r1 * Math.sin(rad)).toFixed(2)
              const y1 = +(40 - r1 * Math.cos(rad)).toFixed(2)
              const x2 = +(40 + r2 * Math.sin(rad)).toFixed(2)
              const y2 = +(40 - r2 * Math.cos(rad)).toFixed(2)
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={deg % 90 === 0 ? '1.2' : '0.6'}
                />
              )
            })}
            <line x1="40" y1="40" x2="40" y2="22" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="40" y1="40" x2="52" y2="34" strokeWidth="0.9" strokeLinecap="round" />
            <circle cx="40" cy="40" r="1.4" fill="currentColor" />
          </svg>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
        <span
          className={cn(
            'font-sans text-[9px] font-bold uppercase tracking-[0.4em]',
            isDark ? 'text-white/30' : 'text-foreground/30'
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'font-sans text-[9px] uppercase tracking-[0.3em]',
            isDark ? 'text-accent-gold/50' : 'text-accent-gold/60'
          )}
        >
          Warszawski Czas
        </span>
      </div>
    </div>
  )
}
