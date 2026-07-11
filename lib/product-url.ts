export type ProductUrlSource = {
  id?: string
  slug?: string
  brand: string
  name: string
  reference?: string
  year?: number | string
  publishedAt?: string
  urlSlug?: string
}

const UNKNOWN_REFERENCE = /^(do potwierdzenia|do ustalenia|brak|n\/a|na|unknown|tbc|tbd|-)+$/i

/**
 * Product URL utilities without CMS adapter dependencies.
 *
 * Default URLs stay SEO-friendly (`brand + name`). When the adapter detects
 * multiple products with the same base slug, it attaches `urlSlug` to each
 * product; client components then use that canonical value.
 */

export function slugifyProductUrlPart(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function productBaseUrlSlug(p: Pick<ProductUrlSource, 'brand' | 'name'>): string {
  return slugifyProductUrlPart(`${p.brand} ${p.name}`) || 'produkt'
}

export function productUrlSlug(
  p: Pick<ProductUrlSource, 'brand' | 'name'> & Partial<ProductUrlSource>,
): string {
  const explicit = p.urlSlug ? slugifyProductUrlPart(p.urlSlug) : ''
  return explicit || productBaseUrlSlug(p)
}

function productStableKey(product: ProductUrlSource, index: number): string {
  return (
    product.id ||
    product.slug ||
    `${product.brand}|${product.name}|${product.reference ?? ''}|${product.year ?? ''}|${index}`
  )
}

function normalizedPublishedAt(product: ProductUrlSource): string {
  const timestamp = product.publishedAt ? Date.parse(product.publishedAt) : NaN
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : ''
}

function duplicateSortKey(product: ProductUrlSource, index: number): string {
  return [
    normalizedPublishedAt(product),
    product.id ?? '',
    product.slug ?? '',
    product.reference ?? '',
    String(product.year ?? ''),
    String(index).padStart(6, '0'),
  ].join('|')
}

function suffixCandidate(product: ProductUrlSource, base: string): string {
  const reference = product.reference?.trim()
  const candidates = [
    reference && !UNKNOWN_REFERENCE.test(reference) ? reference : undefined,
    product.year ? String(product.year) : undefined,
    product.slug,
    product.id,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue
    let suffix = slugifyProductUrlPart(candidate)
    if (!suffix || suffix === base) continue
    if (suffix.startsWith(`${base}-`)) suffix = suffix.slice(base.length + 1)
    if (!suffix || suffix === base) continue
    return suffix
  }

  return 'egzemplarz'
}

function makeUniqueSlug(
  preferred: string,
  used: Set<string>,
): string {
  const cleanPreferred = slugifyProductUrlPart(preferred) || 'produkt'
  if (!used.has(cleanPreferred)) {
    used.add(cleanPreferred)
    return cleanPreferred
  }

  let counter = 2
  let next = `${cleanPreferred}-${counter}`
  while (used.has(next)) {
    counter += 1
    next = `${cleanPreferred}-${counter}`
  }
  used.add(next)
  return next
}

export function productUrlSlugMap<T extends ProductUrlSource>(
  products: readonly T[],
): Map<string, string> {
  const groups = new Map<string, Array<{ product: T; index: number }>>()
  products.forEach((product, index) => {
    const base = productBaseUrlSlug(product)
    const group = groups.get(base) ?? []
    group.push({ product, index })
    groups.set(base, group)
  })

  const used = new Set<string>()
  const result = new Map<string, string>()
  const sortedGroups = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))

  for (const [base, group] of sortedGroups.filter(([, group]) => group.length === 1)) {
    const item = group[0]
    result.set(
      productStableKey(item.product, item.index),
      makeUniqueSlug(base, used),
    )
  }

  for (const [base, group] of sortedGroups.filter(([, group]) => group.length > 1)) {
    const sorted = [...group].sort((a, b) =>
      duplicateSortKey(a.product, a.index).localeCompare(duplicateSortKey(b.product, b.index)),
    )
    sorted.forEach((item, duplicateIndex) => {
      const preferred =
        duplicateIndex === 0 ? base : `${base}-${suffixCandidate(item.product, base)}`
      result.set(
        productStableKey(item.product, item.index),
        makeUniqueSlug(preferred, used),
      )
    })
  }

  return result
}

export function withProductUrlSlugs<T extends ProductUrlSource>(
  products: readonly T[],
): Array<T & { urlSlug: string }> {
  const slugMap = productUrlSlugMap(products)
  return products.map((product, index) => ({
    ...product,
    urlSlug: slugMap.get(productStableKey(product, index)) ?? productBaseUrlSlug(product),
  }))
}
