import { MetadataRoute } from 'next'
import { getAllProducts, productUrlSlug } from '@/from-cms/adapters/products'
import { absoluteUrl, alternateLanguageUrls, locales, type Locale } from '@/lib/i18n'
import { indexablePublicRoutePaths } from '@/lib/seo-routes'
import { productImageSources, productSeoImageUrl } from '@/lib/product-images'

// Sitemap jest stabilnym artefaktem buildu i korzysta z tego samego snapshotu
// produktów co prerenderowane strony.
export const dynamic = 'force-static'

function validLastModified(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? new Date(timestamp) : undefined
}

function pageEntry(path: string, locale: Locale): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path, locale),
    alternates: { languages: alternateLanguageUrls(path) },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    indexablePublicRoutePaths.map((path) => pageEntry(path, locale)),
  )

  const allProducts = await getAllProducts()
  // Dostępny, Na zamówienie i Niedostępny są pełnoprawnymi stronami produktu.
  // Dostępność opisuje Offer.availability, a nie obecność URL-a w sitemapie.
  const products: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    allProducts.map((product) => {
      const path = `/produkty/${productUrlSlug(product)}`
      const firstImage = productImageSources(product)[0]
      return {
        ...pageEntry(path, locale),
        lastModified: validLastModified(product.updatedAt ?? product.publishedAt),
        images: firstImage
          ? [absoluteUrl(productSeoImageUrl(firstImage, 'medium'))]
          : undefined,
      }
    }),
  )

  return [...pages, ...products]
}
