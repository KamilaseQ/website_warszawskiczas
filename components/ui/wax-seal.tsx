import { cn } from '@/lib/utils'

interface WaxSealProps {
  size?: number
  rotate?: number
  className?: string
  monogram?: string
  year?: string
}

export function WaxSeal({
  size = 80,
  rotate = -8,
  className,
  monogram = 'WC',
  year = 'MMXXVI',
}: WaxSealProps) {
  const monogramSize = Math.round(size * 0.32)
  const yearSize = Math.max(7, Math.round(size * 0.09))

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none relative flex flex-col items-center justify-center select-none',
        className
      )}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full border border-accent-gold/60"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, rgba(201,169,98,0.18) 0%, rgba(201,169,98,0.04) 60%, transparent 100%)',
          boxShadow:
            'inset 0 0 0 1px rgba(201,169,98,0.15), 0 0 18px -6px rgba(201,169,98,0.35)',
        }}
      />
      <div
        className="absolute rounded-full border border-accent-gold/25"
        style={{ inset: Math.max(4, Math.round(size * 0.08)) }}
      />
      <span
        className="relative font-serif italic font-medium text-accent-gold/85 leading-none"
        style={{ fontSize: monogramSize }}
      >
        {monogram}
      </span>
      <span
        className="relative mt-1 font-sans font-bold uppercase text-accent-gold/70"
        style={{
          fontSize: yearSize,
          letterSpacing: '0.35em',
          paddingLeft: '0.35em',
        }}
      >
        {year}
      </span>
    </div>
  )
}
