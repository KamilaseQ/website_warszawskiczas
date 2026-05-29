const path = require('path')

const legacyRedirects = [
  { source: '/skup-zegarkow', destination: '/skup-zegarkow-warszawa', permanent: true },
  { source: '/skup', destination: '/skup-zegarkow-warszawa', permanent: true },
  { source: '/komis-zegarkow', destination: '/komis-zegarkow-warszawa', permanent: true },
  { source: '/komis', destination: '/komis-zegarkow-warszawa', permanent: true },
  { source: '/serwis-zegarkow', destination: '/uslugi/naprawa-i-serwis', permanent: true },
  { source: '/naprawa-i-serwis', destination: '/uslugi/naprawa-i-serwis', permanent: true },
  { source: '/serwis', destination: '/uslugi/naprawa-i-serwis', permanent: true },
  { source: '/oferta', destination: '/produkty', permanent: true },
  { source: '/kontakt-z-nami', destination: '/kontakt', permanent: true },
  { source: '/kontakt-lokalizacja', destination: '/kontakt', permanent: true },
  { source: '/lokalizacja', destination: '/kontakt', permanent: true },
  { source: '/ukryta-kolekcja', destination: '/kolekcja-na-zapytanie', permanent: true },
  { source: '/informacje-o-butiku', destination: '/o-nas', permanent: true },
  { source: '/luxury-watches-warsaw', destination: '/zegarki-luksusowe-warszawa', permanent: true },
  { source: '/newBlogPost-:slug', destination: '/produkty', permanent: true },
  { source: '/knitted-hat-:slug', destination: '/', permanent: true },
  { source: '/bucket-hat-:slug', destination: '/', permanent: true },
  { source: '/futuristic-floating-dome', destination: '/', permanent: true },
  { source: '/zenith-el-primero-espada', destination: '/produkty/zenith-el-primero-espada', permanent: true },
  { source: '/chopard-chronometer', destination: '/produkty/chopard-chronometer-1-of-100', permanent: true },
  { source: '/patek-philippe-perpetual-calender', destination: '/produkty/patek-philippe-perpetual-calendar', permanent: true },
  { source: '/omega-seamaster', destination: '/produkty/omega-seamaster-diver-300-m-chronograph', permanent: true },
  { source: '/audemars-piguet-code-1159', destination: '/produkty/audemars-piguet-code-11-59', permanent: true },
  { source: '/rolex-sky-dweller', destination: '/produkty/rolex-sky-dweller', permanent: true },
  { source: '/patek-philippe-calatrava-annual-calendar', destination: '/produkty/patek-philippe-calatrava-annual-calendar', permanent: true },
  { source: '/rolex-submariner', destination: '/produkty/rolex-submariner', permanent: true },
  { source: '/audemars-piguet-royal-oak', destination: '/produkty/audemars-piguet-royal-oak-automatic', permanent: true },
  { source: '/girard-perregaux-classic', destination: '/produkty/girard-perregaux-classic', permanent: true },
  { source: '/bvlgari-bvlgari', destination: '/produkty/bvlgari-bvlgari-103711', permanent: true },
  { source: '/bvlgari-bvlgari1', destination: '/produkty/bvlgari-bvlgari-bb23gl', permanent: true },
  { source: '/audemars-piguet-royal-oak-red-dial', destination: '/produkty/audemars-piguet-royal-oak-red-dial', permanent: true },
  { source: '/rolex-daytona', destination: '/produkty/rolex-daytona-dial', permanent: true },
  { source: '/cartier-panthere', destination: '/produkty/cartier-panthere', permanent: true },
  { source: '/rolex-yacht-master-40-black-dial', destination: '/produkty/rolex-yacht-master-40-black-dial', permanent: true },
  { source: '/rolex-day-date-rose-gold', destination: '/produkty/rolex-day-date-tridor', permanent: true },
  { source: '/rolex-day-date-silver', destination: '/produkty/rolex-day-date-platinum', permanent: true },
  { source: '/rolex-datejust-iced-out-custom-arabic-dial', destination: '/produkty/rolex-datejust-iced-out-custom-arabic-dial', permanent: true },
  { source: '/cartier-santos-iced-out', destination: '/produkty/cartier-santos-wersja-iced-out', permanent: true },
  { source: '/iwc-chronograph-automatic', destination: '/produkty/iwc-chronograph-portugieser', permanent: true },
  { source: '/iwc-automatic', destination: '/produkty/iwc-portugieser-7-days', permanent: true },
  { source: '/omega-constellation', destination: '/produkty/omega-constellation', permanent: true },
  { source: '/omega-speedmaster-moonwatch', destination: '/produkty/omega-speedmaster-moonwatch-professional', permanent: true },
  {
    source: '/audemars-piguet-royal-oak-blue-dial-boutique-edition',
    destination: '/produkty/audemars-piguet-royal-oak-blue-dial-boutique-edition',
    permanent: true,
  },
  { source: '/patek-philippe-twenty4', destination: '/produkty/patek-philippe-twenty-4', permanent: true },
  { source: '/rolex-wimbledon', destination: '/produkty/rolex-datejust-wimbledon', permanent: true },
  { source: '/iwc-perpetual-calender', destination: '/produkty/iwc-perpetual-calendar-1-of-250', permanent: true },
  {
    source: '/patek-philippe-annual-calendar-chronograph-5960r-001',
    destination: '/produkty/patek-philippe-annual-calendar-chronograph',
    permanent: true,
  },
  { source: '/vacheron-constantin-automatic', destination: '/produkty/vacheron-constantin-overseas', permanent: true },
]

const legacyPhpRedirects = [
  { value: 'top_glowna', destination: '/' },
  { value: '1', destination: '/' },
  { value: '2', destination: '/skup-zegarkow-warszawa' },
  { value: '3', destination: '/uslugi/naprawa-i-serwis' },
  { value: '4', destination: '/komis-zegarkow-warszawa' },
  { value: '5', destination: '/produkty' },
  { value: '6', destination: '/o-nas' },
  { value: '7', destination: '/kontakt' },
]

const serverRedirects = [
  {
    source: '/:path*',
    has: [{ type: 'host', value: 'www.warszawskiczas.pl' }],
    destination: 'https://warszawskiczas.pl/:path*',
    permanent: true,
  },
  ...legacyPhpRedirects.map(({ value, destination }) => ({
    source: '/index.php',
    has: [{ type: 'query', key: 'display', value }],
    destination,
    permanent: true,
  })),
  {
    source: '/index.php',
    has: [{ type: 'query', key: 'display' }],
    destination: '/produkty',
    permanent: true,
  },
  { source: '/index.php', destination: '/', permanent: true },
  ...legacyRedirects,
]

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Content-Security-Policy', value: 'upgrade-insecure-requests' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
]

/**
 * Tryb serwerowy Next.js — strona działa jako aplikacja Node na Hostingerze
 * (build importowany z GitHuba, `next build` + `next start`).
 *
 * Dzięki temu działają Route Handlery (`app/api/*`) i zmienne środowiskowe
 * w runtime — formularz wysyła mail przez `app/api/contact/route.ts`
 * (nodemailer + SMTP ze zmiennych środowiskowych), a lead/WhatsApp lecą
 * osobno do aplikacji CMS (patrz `from-cms/adapters/leads.ts`).
 *
 * `redirects()` i `headers()` poniżej obsługuje runtime serwerowy Next
 * (w trybie statycznym robił to `public/.htaccess`).
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async redirects() {
    return serverRedirects
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
