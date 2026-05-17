import { MetadataRoute } from 'next'

// Wymagane w static export, żeby Next wygenerował plik przy buildzie.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://warszawskiczas.pl/sitemap.xml',
  }
}
