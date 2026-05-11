const path = require('path')

// Bezpieczne, niskoryzykowne nagłówki bezpieczeństwa.
// Świadomie pomijamy CSP (wymaga osobnego sprintu z trybem Report-Only ze
// względu na inline JSON-LD, framer-motion, <style jsx> i Next.js inline scripts)
// oraz X-Frame-Options/frame-ancestors (potencjalna kolizja z mapą Google).
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      // Stare URL-e z poprzedniej wersji domeny — 301 do najmocniejszej nowej strony.
      { source: '/skup-zegarkow', destination: '/skup-zegarkow-warszawa', permanent: true },
      { source: '/skup', destination: '/skup-zegarkow-warszawa', permanent: true },
      { source: '/komis', destination: '/komis-zegarkow-warszawa', permanent: true },
      { source: '/naprawa-i-serwis', destination: '/uslugi/naprawa-i-serwis', permanent: true },
      { source: '/serwis', destination: '/uslugi/naprawa-i-serwis', permanent: true },
      { source: '/oferta', destination: '/produkty', permanent: true },
      { source: '/kontakt-lokalizacja', destination: '/kontakt', permanent: true },
      { source: '/lokalizacja', destination: '/kontakt', permanent: true },
    ]
  },
}

module.exports = nextConfig
