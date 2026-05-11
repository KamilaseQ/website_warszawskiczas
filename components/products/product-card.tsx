'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ImagePlaceholder } from '@/components/ui'
import { cn } from '@/lib/utils'
import { localeFromPathname, localizePath, ui } from '@/lib/i18n'
import { productUrlSlug, type Product } from '@/data/mock-products'

function CardImage({ product }: { product: Product }) {
  const src = product.images?.[0]
  if (!src) {
    return (
      <ImagePlaceholder
        className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        variant="light"
      />
    )
  }
  return (
    <Image
      src={src}
      alt={`${product.brand} ${product.name}`}
      fill
      sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
    />
  )
}

interface ProductCardProps {
  product: Product
  className?: string
  /** aspect ratio klasy obrazu — dla bento */
  aspect?: 'portrait' | 'square' | 'tall' | 'wide'
  /** układ karty: default = standard pionowy, feature = horyzontalny breakout */
  layout?: 'default' | 'feature'
  priority?: boolean
}

const aspectMap = {
  portrait: 'aspect-[4/5] sm:aspect-[3/4]',
  square: 'aspect-square',
  tall: 'aspect-[4/5] sm:aspect-[3/5]',
  wide: 'aspect-[4/3] sm:aspect-[16/10]',
}

export function ProductCard({ product, className, aspect = 'portrait', layout = 'default' }: ProductCardProps) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = ui[locale]
  const reducedMotion = useReducedMotion()
  const formattedPrice = product.price
    ? new Intl.NumberFormat(locale === 'ua' ? 'uk-UA' : locale === 'en' ? 'en-US' : 'pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(product.price)
    : product.priceOnRequest
      ? t.priceOnRequest
      : null

  const statusColor =
    product.status === 'Niedostępny'
      ? 'text-muted-foreground/60 line-through'
      : product.status === 'Zarezerwowany'
        ? 'text-muted-foreground/80'
        : 'text-accent-gold'
  const statusLabel =
    product.status === 'Niedostępny'
      ? t.unavailable
      : product.status === 'Zarezerwowany'
        ? t.reserved
        : product.status === 'Dostępny'
          ? t.available
          : product.status

  // Feature layout: szeroka karta z obrazem po lewej, treścią po prawej.
  if (layout === 'feature') {
    return (
      <Link
        href={localizePath(`/produkty/${productUrlSlug(product)}`, locale)}
        prefetch={false}
        className={cn('group relative grid grid-cols-5 gap-4 sm:gap-6', className)}
      >
        <div className={cn('relative col-span-3 overflow-hidden', 'aspect-[4/3] sm:aspect-[5/4]')}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={`${product.brand} ${product.name}`}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <ImagePlaceholder
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
              variant="light"
            />
          )}
          <Badges product={product} statusColor={statusColor} statusLabel={statusLabel} labels={{ new: t.new, onRequest: t.onRequest }} />
          <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent-gold/40" />
        </div>

        <div className="col-span-2 flex flex-col justify-center">
          <p className="font-sans text-[9px] font-bold uppercase tracking-[0.35em] text-accent-gold sm:text-[10px]">
            {product.brand}
          </p>
          <h3 className="mt-1 font-serif text-base font-medium leading-tight text-foreground transition-colors duration-300 group-hover:text-accent-gold sm:text-2xl">
            {product.name}
          </h3>
          {product.reference && (
            <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
              Ref. {product.reference}
              {product.year ? ` · ${product.year}` : ''}
            </p>
          )}
          <div className="mt-3 h-px w-8 bg-accent-gold/40" />
          <span
            className={cn(
              'mt-3 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] sm:text-[11px]',
              formattedPrice ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {formattedPrice}
          </span>
          <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/70 transition-colors duration-300 group-hover:text-accent-gold sm:text-[10px]">
            {locale === 'pl' ? 'Zobacz' : locale === 'en' ? 'View' : 'Переглянути'}{' '}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={localizePath(`/produkty/${productUrlSlug(product)}`, locale)}
      prefetch={false}
      className={cn(
        'group relative block transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className
      )}
    >
      <div className={cn('relative overflow-hidden', aspectMap[aspect])}>
        {/* Wewnętrzny "dolly" — zdjęcie startuje lekko zoomed-in i się ustawia,
            a na hover jeszcze raz delikatnie się przybliża. */}
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { scale: 1.08 },
            visible: { scale: 1, transition: { duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98] } },
          }}
        >
          <CardImage product={product} />
        </motion.div>

        <Badges product={product} statusColor={statusColor} statusLabel={statusLabel} labels={{ new: t.new, onRequest: t.onRequest }} />

        {/* Akcent w prawym dolnym narożniku — kreślony złotem na hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-2 z-10 h-3 w-3"
        >
          <span className="absolute bottom-0 right-0 h-px w-0 bg-accent-gold transition-[width] duration-500 ease-out group-hover:w-full" />
          <span className="absolute bottom-0 right-0 h-0 w-px bg-accent-gold transition-[height] delay-100 duration-500 ease-out group-hover:h-full" />
        </span>

        {/* Złota linia pod zdjęciem — rysuje się od lewej na hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 block h-px origin-left scale-x-0 bg-accent-gold transition-transform duration-[700ms] ease-out group-hover:scale-x-100"
        />

        <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent-gold/30" />

        {/* Kurtyna wejścia — odsłania TYLKO obszar zdjęcia, nigdy nie zasłania
            tekstów pod kafelkiem. Płynie ku górze z cienką złotą krawędzią. */}
        {!reducedMotion && (
          <motion.div
            aria-hidden="true"
            variants={{
              hidden: { y: '0%' },
              visible: {
                y: '-101%',
                transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1], delay: 0.1 },
              },
            }}
            className="pointer-events-none absolute inset-0 z-30 origin-top bg-muted"
          >
            <span className="absolute inset-x-0 bottom-0 block h-px bg-accent-gold" />
          </motion.div>
        )}
      </div>

      <motion.div
        className="mt-3 sm:mt-4"
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.45 },
          },
        }}
      >
        <p className="font-sans text-[8px] font-bold uppercase tracking-[0.35em] text-accent-gold sm:text-[10px]">
          {product.brand}
        </p>
        <h3 className="mt-1 font-serif text-sm font-medium leading-tight text-foreground transition-colors duration-300 group-hover:text-accent-gold sm:text-xl">
          {product.name}
        </h3>
        {product.reference && (
          <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
            Ref. {product.reference}
            {product.year ? ` · ${product.year}` : ''}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3 sm:gap-4">
          <span
            className={cn(
              'font-sans text-[10px] font-semibold uppercase tracking-[0.15em] sm:text-[11px]',
              formattedPrice ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {formattedPrice}
          </span>
          <span className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/70 transition-colors duration-300 group-hover:text-accent-gold sm:inline-flex">
            {locale === 'pl' ? 'Zobacz' : locale === 'en' ? 'View' : 'Переглянути'}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

function Badges({
  product,
  statusColor,
  statusLabel,
  labels,
}: {
  product: Product
  statusColor: string
  statusLabel?: string
  labels: { new: string; onRequest: string }
}) {
  return (
    <>
      {product.status && (
        <div className="absolute right-0 top-0 bg-[#0a0a0a] px-2 py-1 sm:px-3 sm:py-1.5">
          <span
            className={cn(
              'font-sans text-[8px] font-bold uppercase tracking-[0.3em] sm:text-[9px]',
              statusColor
            )}
          >
            {statusLabel ?? product.status}
          </span>
        </div>
      )}
      {(product.isNew || product.isExclusive) && (
        <div className="absolute left-0 top-0 flex flex-col gap-0">
          {product.isNew && (
            <span className="bg-accent-gold px-2 py-1 font-sans text-[8px] font-bold uppercase tracking-[0.3em] text-[#0a0a0a] sm:px-3 sm:py-1.5 sm:text-[9px]">
              {labels.new}
            </span>
          )}
          {product.isExclusive && (
            <span className="bg-[#0a0a0a] px-2 py-1 font-sans text-[8px] font-bold uppercase tracking-[0.3em] text-accent-gold sm:px-3 sm:py-1.5 sm:text-[9px]">
              {labels.onRequest}
            </span>
          )}
        </div>
      )}
    </>
  )
}
