import type { Product, ProductImageAsset } from '@/from-cms/schemas/product'
import { cdnImageVariant, type CdnImageVariant } from '@/lib/cdn-image'

export type ProductImageSource = string | ProductImageAsset

/** Prefer the explicit CMS contract; legacy strings keep mock/old snapshots working. */
export function productImageSources(product: Pick<Product, 'imageAssets' | 'images'>): ProductImageSource[] {
  if (product.imageAssets?.length) return product.imageAssets
  return product.images ?? []
}

export function productImageOriginal(image: ProductImageSource): string {
  return typeof image === 'string' ? image : image.original
}

export function productImageAlt(image: ProductImageSource, fallback: string): string {
  if (typeof image === 'string') return fallback
  return image.alt?.trim() || fallback
}

export function productImageVariantUrl(
  image: ProductImageSource,
  variant: CdnImageVariant,
): string {
  if (typeof image === 'string') {
    // Only legacy snapshots use derived paths and a runtime fallback.
    return cdnImageVariant(image, variant) ?? image
  }
  return image[variant] ?? image.original
}

/**
 * SEO nie ma runtime `onError`, więc dla starego `images: string[]` nie wolno
 * zgadywać URL-a wariantu. Jawny kontrakt `imageAssets` może bezpiecznie użyć WebP.
 */
export function productSeoImageUrl(
  image: ProductImageSource,
  variant: CdnImageVariant,
): string {
  return typeof image === 'string' ? image : productImageVariantUrl(image, variant)
}

export function productSeoImageUrls(
  product: Pick<Product, 'imageAssets' | 'images'>,
  variant: CdnImageVariant,
): string[] {
  return productImageSources(product).map((image) =>
    productSeoImageUrl(image, variant),
  )
}

export function productOriginalUrls(product: Pick<Product, 'imageAssets' | 'images'>): string[] {
  return productImageSources(product).map(productImageOriginal)
}
