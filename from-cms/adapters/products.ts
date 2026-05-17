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
    return cache
  }
  cache = await fetchFromCms()
  return cache
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts()
  return all.find((p) => p.slug === slug) ?? null
}

/**
 * Kanoniczny URL produktu — zawsze w formie "marka-model" (kebab-case),
 * niezależnie od wewnętrznego `slug`.
 */
export function productUrlSlug(p: Pick<Product, 'brand' | 'name'>): string {
  const raw = `${p.brand} ${p.name}`
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function findProductByUrlSlug(urlSlug: string): Promise<Product | null> {
  const all = await getAllProducts()
  return all.find((p) => productUrlSlug(p) === urlSlug) ?? null
}

export async function getFeaturedProduct(): Promise<Product> {
  const all = await getAllProducts()
  const first = all[0]
  if (!first) {
    throw new Error('[from-cms] No products available — fixtures or CMS returned empty list')
  }
  return all.find((p) => p.featured) ?? first
}

export async function getOtherFeaturedProducts(limit = 6): Promise<Product[]> {
  const all = await getAllProducts()
  return all.filter((p) => !p.featured && p.category === 'zegarki').slice(0, limit)
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts()
  return all.slice(0, limit)
}
