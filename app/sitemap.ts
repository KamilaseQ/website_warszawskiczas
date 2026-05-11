import { MetadataRoute } from 'next'
import { mockProducts, productUrlSlug } from '@/data/mock-products'
import { absoluteUrl, locales, publicRoutePaths, type Locale } from '@/lib/i18n'

const LAST_CONTENT_UPDATE = '2026-05-10'

const priorityForPath = (path: string) => {
  if (path === '/') return 1
  if (path === '/produkty') return 0.9
  if (path.includes('skup') || path.includes('zegarki-')) return 0.85
  if (path === '/butik') return 0.8
  if (path.startsWith('/uslugi')) return 0.75
  if (path === '/kontakt') return 0.6
  return 0.55
}

const frequencyForPath = (path: string): MetadataRoute.Sitemap[number]['changeFrequency'] => {
  if (path === '/produkty') return 'daily'
  if (path === '/') return 'weekly'
  return 'monthly'
}

function entry(path: string, locale: Locale, priority = priorityForPath(path)): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path, locale),
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: frequencyForPath(path),
    priority,
    alternates: {
      languages: {
        pl: absoluteUrl(path, 'pl'),
        en: absoluteUrl(path, 'en'),
        'uk-UA': absoluteUrl(path, 'ua'),
        'x-default': absoluteUrl(path, 'pl'),
      },
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = publicRoutePaths.filter((path) => path !== '/kontakt/dziekujemy')

  const pages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    routes.map((path) => entry(path, locale)),
  )

  const products: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    mockProducts
      .filter((p) => p.status !== 'Niedostępny')
      .map((p) => {
        const path = `/produkty/${productUrlSlug(p)}`
        const firstImage = p.images?.[0]
        return {
          ...entry(path, locale, 0.7),
          changeFrequency: 'weekly' as const,
          images: firstImage ? [absoluteUrl(firstImage)] : undefined,
        }
      }),
  )

  return [...pages, ...products]
}
