import type { Product } from '@/from-cms/schemas/product'

/**
 * Helpers do wybierania produktów pod sekcję "wybrane egzemplarze" na landing pages SEO.
 *
 * Każdy filtr przyjmuje pełną listę produktów jako parametr (DI). Caller pobiera ją raz
 * przez `await getAllProducts()` z `@/from-cms/adapters/products` i przekazuje do filtrów.
 *
 * Wynik: dostępne (nie `Niedostępny`) zegarki, posortowane — najpierw featured, potem reszta.
 * Status `Niedostępny` jest pełnoprawnym stanem operacyjnym (sprowadzamy na zamówienie),
 * ale w preview na landingach pokazujemy domyślnie te z magazynu.
 */

const isAvailable = (p: Product) => p.status !== 'Niedostępny'

const sortForPreview = (a: Product, b: Product) => {
  if (a.featured && !b.featured) return -1
  if (!a.featured && b.featured) return 1
  if (a.priceOnRequest && !b.priceOnRequest) return -1
  if (!a.priceOnRequest && b.priceOnRequest) return 1
  return 0
}

export function productsByBrand(products: Product[], brand: string, limit = 6): Product[] {
  return products
    .filter((p) => p.brand.toLowerCase() === brand.toLowerCase() && isAvailable(p))
    .sort(sortForPreview)
    .slice(0, limit)
}

const matches = (p: Product, re: RegExp) => {
  const haystack = `${p.material ?? ''} ${p.name} ${p.description ?? ''} ${p.editorial ?? ''} ${p.story ?? ''}`
  return re.test(haystack)
}

export function goldWatches(products: Product[], limit = 6): Product[] {
  const re = /(złot|gold|18\s?k|rose gold|yellow gold|white gold|tridor|everose|sundust)/i
  return products.filter((p) => isAvailable(p) && matches(p, re)).sort(sortForPreview).slice(0, limit)
}

export function diamondWatches(products: Product[], limit = 6): Product[] {
  const re = /(diament|diamond|brylant|iced out)/i
  return products.filter((p) => isAvailable(p) && matches(p, re)).sort(sortForPreview).slice(0, limit)
}

export function chronographWatches(products: Product[], limit = 6): Product[] {
  const re = /(chronograph|chronograf|daytona|speedmaster)/i
  return products.filter((p) => isAvailable(p) && matches(p, re)).sort(sortForPreview).slice(0, limit)
}

export function ladiesWatches(products: Product[], limit = 6): Product[] {
  const re = /(damski|panthère|panthere|baignoire|happy sport|twenty[- ]?4|mini|ladies|women|kobiec|biżuteryjn)/i
  // Także koperty < 36 mm uznajemy za damskie / unisex małe.
  const compact = (p: Product) => {
    if (!p.caseSize) return false
    const m = p.caseSize.match(/(\d{2}(?:[.,]\d)?)/)
    if (!m) return false
    const mm = parseFloat(m[1].replace(',', '.'))
    return !Number.isNaN(mm) && mm <= 35
  }
  return products
    .filter((p) => isAvailable(p) && (matches(p, re) || compact(p)))
    .sort(sortForPreview)
    .slice(0, limit)
}

export function sportWatches(products: Product[], limit = 6): Product[] {
  const re = /(submariner|sea[- ]?master|seamaster|diver|yacht[- ]?master|gmt[- ]?master|royal oak|nautilus|aquanaut|overseas|chronograph|chronograf|speedmaster|daytona|sport)/i
  return products.filter((p) => isAvailable(p) && matches(p, re)).sort(sortForPreview).slice(0, limit)
}

export function vintageWatches(products: Product[], limit = 6): Product[] {
  const re = /(vintage|retro|kolekcj|histor|lat \d{2}|1970|1980|1960|kolekcjonersk)/i
  return products.filter((p) => isAvailable(p) && matches(p, re)).sort(sortForPreview).slice(0, limit)
}

export function bicolorWatches(products: Product[], limit = 6): Product[] {
  const re = /(bicolor|stal-złoto|stal\/złoto|stal i złoto|two[- ]?tone|rolesor)/i
  return products.filter((p) => isAvailable(p) && matches(p, re)).sort(sortForPreview).slice(0, limit)
}
