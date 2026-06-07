/**
 * Adapter dostępu do produktów — Single point of contact strona <-> CMS.
 *
 * - mock mode → czyta `from-cms/fixtures/products.json` i waliduje przez zod
 * - live mode → fetch z `${CMS_API_URL}/api/v1/products` (build-time only)
 *
 * Cache: `getAllProducts()` cache-uje w pamięci modułu w obrębie jednego procesu
 * buildu — żeby nie odpytywać CMSa setki razy podczas SSG ~120 stron.
 */

import { ProductListSchema, type Product } from '../schemas/product'
import { CMS_MODE, assertLiveConfig } from '../mode'
import fixtures from '../fixtures/products.json'
import { productUrlSlug as productUrlSlugPure } from '@/lib/product-url'

/** @deprecated Importuj z `@/lib/product-url`. Reeksport dla zgodności. */
export const productUrlSlug = productUrlSlugPure

let cache: Product[] | null = null

async function fetchFromCms(): Promise<Product[]> {
  const { url, token } = assertLiveConfig()
  const res = await fetch(`${url}/api/v1/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new Error(`[from-cms] CMS responded ${res.status} ${res.statusText}`)
  }
  const json: unknown = await res.json()
  return ProductListSchema.parse(json)
}

export async function getAllProducts(): Promise<Product[]> {
  if (cache) return cache
  if (CMS_MODE === 'mock') {
    cache = ProductListSchema.parse(fixtures)
    // Widoczne w logu builda Hostingera - jasny sygnał, że NIE czytamy z CMS-a.
    console.log(
      `[from-cms] MOCK: użyto ${cache.length} produktów z fixtures (CMS_MODE="${process.env.CMS_MODE ?? 'unset'}").`,
    )
    return cache
  }
  cache = await fetchFromCms()
  console.log(`[from-cms] LIVE: pobrano ${cache.length} produktów z CMS-a.`)
  return cache
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts()
  return all.find((p) => p.slug === slug) ?? null
}

export async function findProductByUrlSlug(urlSlug: string): Promise<Product | null> {
  const all = await getAllProducts()
  return all.find((p) => productUrlSlugPure(p) === urlSlug) ?? null
}

export async function getFeaturedProduct(): Promise<Product> {
  const all = await getAllProducts()
  const first = all[0]
  if (!first) {
    throw new Error('[from-cms] No products available — fixtures or CMS returned empty list')
  }
  return all.find((p) => p.featured) ?? first
}

/**
 * Kuratorowana lista do sekcji „Inne modele w butiku" — kolejność stała,
 * topowe referencje (Rolex / AP / Patek / IWC / Omega). Brakujące slugi są
 * pomijane, a lista jest uzupełniana pozostałymi zegarkami do `limit`.
 */
const OTHER_FEATURED_SLUGS = [
  'rolex-submariner',
  'rolex-yacht-master-40-black-dial',
  'patek-philippe-annual-calendar-5396',
  'omega-seamaster-diver-300-m-chronograph',
  'audemars-piguet-royal-oak-automatic',
  'iwc-chronograph-portugieser',
]

export async function getOtherFeaturedProducts(limit = 6): Promise<Product[]> {
  const all = await getAllProducts()
  const bySlug = new Map(all.map((p) => [p.slug, p]))
  const curated = OTHER_FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (p): p is Product => Boolean(p) && !p!.featured,
  )
  if (curated.length >= limit) return curated.slice(0, limit)
  const used = new Set(curated.map((p) => p.slug))
  const fill = all.filter(
    (p) => !p.featured && p.category === 'zegarki' && !used.has(p.slug),
  )
  return [...curated, ...fill].slice(0, limit)
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts()
  return all.slice(0, limit)
}
