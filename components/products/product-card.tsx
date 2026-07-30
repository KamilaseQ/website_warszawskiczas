'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ImagePlaceholder } from '@/components/ui'
import { cn } from '@/lib/utils'
import { localeFromPathname, localizePath, ui } from '@/lib/i18n'
import { productUrlSlug } from '@/lib/product-url'
import { formatProductPrice, localizeProductStatus } from '@/lib/localized-products'
import { ProductImage } from '@/components/products/product-image'
import type { CdnImageVariant } from '@/lib/cdn-image'
import type { CatalogProduct } from '@/lib/catalog-product'
import { productImageAlt, productImageSources } from '@/lib/product-images'

function CardImage({
  product,
  priority = false,
  variant,
  deferUntilVisible = false,
}: {
  product: CatalogProduct
  priority?: boolean
  variant: CdnImageVariant
  deferUntilVisible?: boolean
}) {
  const image = productImageSources(product)[0]
  if (!image) {
    return (
      <ImagePlaceholder
        className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        variant="light"
      />
    )
  }
  return (
    <ProductImage
      image={image}
      variant={variant}
      alt={productImageAlt(image, `${product.brand} ${product.name}`)}
      fill
      priority={priority}
      fetchPriority={priority ? 'high' : 'auto'}
      loading={priority ? 'eager' : 'lazy'}
      deferUntilVisible={deferUntilVisible}
      sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 45vw"
      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
    />
  )
}

interface ProductCardProps {
  product: CatalogProduct
  className?: string
  /** aspect ratio klasy obrazu — dla bento */
  aspect?: 'portrait' | 'square' | 'tall' | 'wide'
  /** układ karty: default = standard pionowy, feature = horyzontalny breakout */
  layout?: 'default' | 'feature'
  priority?: boolean
  /** Katalog używa lekkiego `thumb`; większe pojedyncze karty mogą wybrać `medium`. */
  imageVariant?: CdnImageVariant
  /** Stabilny znacznik wyłącznie dla kart w głównym katalogu i jego testów. */
  catalogItem?: boolean
}

// Tymczasowo wyłączone plakietki na kartach produktów (status „Dostępny",
// „Nowość", „Na zapytanie"). Kod plakietek zostaje — wystarczy ustawić `true`,
// gdy uporządkujemy które oznaczenia pasują do których zegarków.
const SHOW_PRODUCT_BADGES = false

const aspectMap = {
  portrait: 'aspect-[4/5] sm:aspect-[3/4]',
  square: 'aspect-square',
  tall: 'aspect-[4/5] sm:aspect-[3/5]',
  wide: 'aspect-[4/3] sm:aspect-[16/10]',
}

export function ProductCard({
  product,
  className,
  aspect = 'portrait',
  layout = 'default',
  priority = false,
  imageVariant = 'medium',
  catalogItem = false,
}: ProductCardProps) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = ui[locale]
  const formattedPrice = formatProductPrice(product, locale)
  const primaryImage = productImageSources(product)[0]
  const ProductNameHeading = catalogItem ? 'h2' : 'h3'

  const statusColor =
    product.status === 'Niedostępny'
      ? 'text-muted-foreground/80'
      : 'text-accent-gold'
  const statusLabel = localizeProductStatus(product.status, locale)

  // Feature layout: szeroka karta z obrazem po lewej, treścią po prawej.
  if (layout === 'feature') {
    return (
      <Link
        href={localizePath(`/produkty/${productUrlSlug(product)}`, locale)}
        prefetch={false}
        className={cn('group relative grid grid-cols-5 gap-4 sm:gap-6', className)}
      >
        <div className={cn('relative col-span-3 overflow-hidden', 'aspect-[4/3] sm:aspect-[5/4]')}>
          {primaryImage ? (
            <ProductImage
              image={primaryImage}
              variant="medium"
              alt={productImageAlt(primaryImage, `${product.brand} ${product.name}`)}
              fill
              priority={priority}
              fetchPriority={priority ? 'high' : 'auto'}
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
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-accent-gold-dark">
            {product.brand}
          </p>
          <ProductNameHeading className="mt-1 font-serif text-base font-medium leading-tight text-foreground transition-colors duration-300 group-hover:text-accent-gold sm:text-2xl">
            {product.name}
          </ProductNameHeading>
          {(product.reference || product.year) && (
            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
              {product.reference ? `Ref. ${product.reference}` : product.year}
              {product.reference && product.year ? ` · ${product.year}` : ''}
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
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/70 transition-colors duration-300 group-hover:text-accent-gold">
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
      data-catalog-card={catalogItem ? '' : undefined}
      className={cn(
        'group relative block transition-transform duration-500 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background',
        className
      )}
    >
      <div className={cn('relative overflow-hidden bg-muted', aspectMap[aspect])}>
        <div className="absolute inset-0">
          <CardImage
            product={product}
            priority={priority}
            variant={imageVariant}
            deferUntilVisible={catalogItem && !priority}
          />
        </div>

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
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold-dark">
          {product.brand}
        </p>
        <ProductNameHeading className="mt-1 font-serif text-base font-medium leading-tight text-foreground transition-colors duration-300 group-hover:text-accent-gold sm:text-xl">
          {product.name}
        </ProductNameHeading>
        {(product.reference || product.year) && (
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[11px] sm:tracking-[0.2em]">
            {product.reference ? `Ref. ${product.reference}` : product.year}
            {product.reference && product.year ? ` · ${product.year}` : ''}
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
      </div>
    </Link>
  )
}

function Badges({
  product,
  statusColor,
  statusLabel,
  labels,
}: {
  product: Pick<CatalogProduct, 'status' | 'isNew' | 'isExclusive'>
  statusColor: string
  statusLabel?: string
  labels: { new: string; onRequest: string }
}) {
  // Plakietki tymczasowo ukryte — patrz SHOW_PRODUCT_BADGES.
  if (!SHOW_PRODUCT_BADGES) return null
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
