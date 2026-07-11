import { MetadataRoute } from 'next'

// Wymagane w static export, żeby Next wygenerował plik przy buildzie.
export const dynamic = 'force-static'

const searchAndAiBots = [
  'Googlebot',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      ...searchAndAiBots.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: 'https://warszawskiczas.pl/sitemap.xml',
  }
}
