const path = require('path')

/**
 * Static export — strona wypluwa `out/` z czystym HTML/CSS/JS, deployowanym
 * na Hostinger Business przez FTP/GitHub Action.
 *
 * `output: 'export'` aktywne TYLKO w produkcyjnym buildzie (NODE_ENV=production).
 * Dev mode (NODE_ENV=development) używa standardowego serwera Next, dzięki czemu:
 *  - `dynamicParams=true` w catch-all działa (strict matching encoded vs decoded
 *    UTF-8 URL-i znika)
 *  - HMR + fast refresh nie konfliktują z restrykcjami exportu
 *
 * Konsekwencje stałe (w obu trybach):
 *  - brak Route Handlers (`app/api/*`) — formularze idą przez CMS webhook
 *    (patrz `from-cms/adapters/leads.ts`)
 *  - brak middleware — i18n przez per-page `metadata.alternates`
 *  - obrazy serwowane są z CDN R2 (`cdn.warszawskiczas.pl`)
 *  - `redirects()` i `headers()` w `public/.htaccess` (Apache na Hostingerze)
 */
const isProductionBuild = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isProductionBuild ? { output: 'export' } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.warszawskiczas.pl' },
      { protocol: 'https', hostname: 'cdn.camalio.pl' },
      { protocol: 'https', hostname: 'warszawskiczas.pl' },
    ],
  },
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
