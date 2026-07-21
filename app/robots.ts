import { MetadataRoute } from 'next'

// Stabilny artefakt buildu aplikacji Next.js działającej w trybie serwerowym.
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
