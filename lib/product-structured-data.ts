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

/**
 * Normalizuje wagę zapisaną przez CMS. Starsze rekordy zawierają zarówno
 * wartości liczbowe (`12`), jak i gotowe etykiety (`12 g`), dlatego jednostkę
 * dokładamy tylko wtedy, gdy nie ma jej już w danych.
 */
export function formatProductWeight(value: unknown): string | undefined {
  const weight = cleanValue(value)
  if (!weight) return undefined

  const grams = weight.match(
    /^(.*\d)\s*(?:(?:g|gr|gram(?:s|y|ów)?)\.?\s*)+$/iu,
  )
  if (grams) return `${grams[1].trim()} g`

  // Nie zmieniamy jawnie podanej innej jednostki.
  if (/^.*\d\s*(?:mg|kg|milligrams?|kilograms?)\.?$/iu.test(weight)) {
    return weight
  }

  return `${weight} g`
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
  const categoryProperties: Array<[string, unknown]> =
    product.category === 'zegarki'
      ? [['Case size', product.caseSize]]
      : product.category === 'bizuteria'
        ? [
            ['Fineness', product.fineness],
            ['Gemstone', product.gemstone],
            ['Weight', formatProductWeight(product.weightG)],
            ['Jewellery size', product.jewelrySize],
          ]
        : []
  const rawProperties: Array<[string, unknown]> = [
    ['Reference', reference],
    ...categoryProperties,
    ['Production year', product.year],
    ['Condition', product.condition],
    ['Material', product.material],
    ['Availability status', product.status],
  ]
  const properties = rawProperties.flatMap(([name, value]) => {
    const clean = cleanValue(value)
    return clean
      ? [
          {
            '@type': 'PropertyValue',
            name,
            value: clean,
          },
        ]
      : []
  })

  return properties.length ? properties : undefined
}
