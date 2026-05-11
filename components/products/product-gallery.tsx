'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ImagePlaceholder } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'

interface ProductGalleryProps {
  brand: string
  name: string
  images?: string[]
}

export function ProductGallery({ brand, name, images = [] }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  const hasImages = images.length > 0
  const safeActive = Math.min(active, Math.max(0, images.length - 1))
  const currentSrc = images[safeActive]

  useBodyScrollLock(zoom)

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false)
      if (hasImages && e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length)
      if (hasImages && e.key === 'ArrowLeft')
        setActive((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [zoom, hasImages, images.length])

  const next = () => hasImages && setActive((i) => (i + 1) % images.length)
  const prev = () =>
    hasImages && setActive((i) => (i - 1 + images.length) % images.length)

  return (
    <div>
      {/* Main image — stała proporcja niezależnie od liczby zdjęć */}
      <div className="group relative">
        <button
          type="button"
          onClick={() => hasImages && setZoom(true)}
          className={cn(
            'relative block aspect-square w-full overflow-hidden bg-muted sm:aspect-[4/5]',
            hasImages ? 'cursor-zoom-in' : 'cursor-default'
          )}
          aria-label={hasImages ? `Powiększ zdjęcie ${brand} ${name}` : `${brand} ${name}`}
        >
          {hasImages ? (
            <Image
              src={currentSrc!}
              alt={`${brand} ${name}`}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />
          ) : (
            <ImagePlaceholder
              variant="light"
              className="absolute inset-0"
              label={`${brand} ${name}`}
            />
          )}
          <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent-gold/40" />
          {hasImages && (
            <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 bg-[#0a0a0a]/80 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Powiększ <span aria-hidden>+</span>
            </span>
          )}
        </button>

        {/* Strzałki przewijania — pojawiają się tylko gdy >1 zdjęcie */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Poprzednie zdjęcie"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-[#0a0a0a]/60 text-white/85 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#0a0a0a]/80 hover:text-accent-gold group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Następne zdjęcie"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-[#0a0a0a]/60 text-white/85 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#0a0a0a]/80 hover:text-accent-gold group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-4 left-4 bg-[#0a0a0a]/70 px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-white/80">
              {safeActive + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails — dynamiczna siatka, max 6 w rzędzie, scroll przy większej liczbie */}
      {images.length > 1 && (
        <div
          className={cn(
            'mt-4 grid gap-2 sm:gap-3',
            images.length <= 3 && 'grid-cols-3',
            images.length === 4 && 'grid-cols-4',
            images.length === 5 && 'grid-cols-5',
            images.length >= 6 && 'grid-cols-6'
          )}
        >
          {images.map((src, i) => {
            const isActive = i === safeActive
            return (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'group/thumb relative aspect-square overflow-hidden border transition-colors duration-300',
                  isActive
                    ? 'border-accent-gold'
                    : 'border-transparent hover:border-accent-gold/40'
                )}
                aria-label={`Zdjęcie ${i + 1}`}
                aria-current={isActive}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className={cn(
                    'object-cover transition-opacity duration-300',
                    isActive ? 'opacity-100' : 'opacity-80 group-hover/thumb:opacity-100'
                  )}
                />
              </button>
            )
          })}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {zoom && hasImages && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Powiększenie zdjęcia produktu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0a0a0a]/95 p-6"
            onClick={() => setZoom(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setZoom(false)
              }}
              className="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-accent-gold hover:text-accent-gold"
              aria-label="Zamknij"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  aria-label="Poprzednie"
                  className="absolute left-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-accent-gold hover:text-accent-gold"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  aria-label="Następne"
                  className="absolute right-6 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-accent-gold hover:text-accent-gold"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <motion.div
              key={safeActive}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={currentSrc!}
                  alt={`${brand} ${name}`}
                  fill
                  sizes="80vw"
                  className="object-contain"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActive(i)}
                      className={cn(
                        'h-1 w-8 transition-colors duration-300',
                        i === safeActive
                          ? 'bg-accent-gold'
                          : 'bg-white/30 hover:bg-white/60'
                      )}
                      aria-label={`Zdjęcie ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
