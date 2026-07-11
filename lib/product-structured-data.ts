import type { Product, ProductCategory } from '@/from-cms/schemas/product'
import type { Locale } from '@/lib/i18n'

const UNKNOWN_REFERENCE = /^(do potwierdzenia|do ustalenia|brak|n\/a|na|unknown|tbc|tbd|-)+$/i

const CATEGORY_LABELS: Record<ProductCategory, Record<Locale, string>> = {
  zegarki: {
    pl: 'Zegarki luksusowe',
    en: 'Luxury watches',
    ua: 'Люксові годинники',
  },
  bizuteria: {
    pl: 'Biżuteria luksusowa',
    en: 'Luxury jewellery',
    ua: 'Люксові ювелірні вироби',
  },
  akcesoria: {
    pl: 'Akcesoria luksusowe',
    en: 'Luxury accessories',
    ua: 'Люксові аксесуари',
  },
}

function cleanValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  const text = String(value).trim()
  return text ? text : undefined
}

export function productReferenceIdentifier(
  product: Pick<Product, 'reference'>,
): string | undefined {
  const reference = cleanValue(product.reference)
  if (!reference || UNKNOWN_REFERENCE.test(reference)) return undefined
  return reference
}

export function productItemCondition(
  product: Pick<Product, 'condition' | 'isNew'>,
): string {
  if (product.isNew || /\b(nowy|nowa|new)\b/i.test(product.condition ?? '')) {
    return 'https://schema.org/NewCondition'
  }
  return 'https://schema.org/UsedCondition'
}

export function productCategoryName(category: ProductCategory, locale: Locale): string {
  return CATEGORY_LABELS[category]?.[locale] ?? CATEGORY_LABELS.zegarki[locale]
}

export function productAdditionalProperties(product: Product) {
  const reference = productReferenceIdentifier(product)
  const properties = [
    ['Reference', reference],
    ['Case size', product.caseSize],
    ['Production year', product.year],
    ['Condition', product.condition],
    ['Availability status', product.status],
  ]
    .map(([name, value]) => {
      const clean = cleanValue(value)
      if (!clean) return null
      return {
        '@type': 'PropertyValue',
        name,
        value: clean,
      }
    })
    .filter(Boolean)

  return properties.length ? properties : undefined
}
