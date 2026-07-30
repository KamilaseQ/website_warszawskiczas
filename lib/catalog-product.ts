import type { Product } from '@/from-cms/schemas/product'
import { productUrlSlug } from '@/lib/product-url'

/**
 * Minimalny kontrakt siatki katalogu.
 *
 * ProductCatalog jest komponentem klienckim, więc każde przekazane pole trafia do
 * payloadu RSC. Karta potrzebuje tylko pierwszego zdjęcia i krótkich danych
 * sprzedażowych — długie opisy, historia i pozostałe zdjęcia są pobierane dopiero
 * na stronie konkretnego produktu.
 */
export type CatalogProduct = Pick<
  Product,
  | 'id'
  | 'slug'
  | 'name'
  | 'brand'
  | 'category'
  | 'reference'
  | 'year'
  | 'price'
  | 'priceOnRequest'
  | 'isNew'
  | 'isExclusive'
  | 'featured'
  | 'status'
  | 'imageAssets'
  | 'images'
> & {
  urlSlug?: string
}

export function toCatalogProduct(product: Product): CatalogProduct {
  const imageAssets = product.imageAssets?.slice(0, 1)
  return {
    id: product.id,
    slug: product.slug,
    urlSlug: productUrlSlug(product),
    name: product.name,
    brand: product.brand,
    category: product.category,
    reference: product.reference,
    year: product.year,
    price: product.price,
    priceOnRequest: product.priceOnRequest,
    isNew: product.isNew,
    isExclusive: product.isExclusive,
    featured: product.featured,
    status: product.status,
    imageAssets,
    images: imageAssets?.length ? undefined : product.images?.slice(0, 1),
  }
}
