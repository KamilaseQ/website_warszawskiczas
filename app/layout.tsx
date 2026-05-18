import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import { SessionTracker } from '@/components/session-tracker'
import { HtmlLangSync } from '@/components/html-lang-sync'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Warszawski Czas | Butik Zegarków Premium',
    template: '%s | Warszawski Czas',
  },
  description:
    'Butik zegarków premium w sercu Warszawy. Ekskluzywna kolekcja zegarków, profesjonalny serwis zegarmistrzowski, skup i komis. Mokotowska 71.',
  authors: [{ name: 'Warszawski Czas' }],
  metadataBase: new URL('https://warszawskiczas.pl'),
  alternates: {
    canonical: 'https://warszawskiczas.pl/',
    languages: {
      pl: 'https://warszawskiczas.pl/',
      en: 'https://warszawskiczas.pl/en',
      'uk-UA': 'https://warszawskiczas.pl/ua',
      'x-default': 'https://warszawskiczas.pl/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Warszawski Czas',
    title: 'Warszawski Czas | Butik Zegarków Premium',
    description:
      'Butik zegarków premium w sercu Warszawy. Mokotowska 71 — kolekcja, serwis, skup, komis.',
    url: 'https://warszawskiczas.pl',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warszawski Czas | Butik Zegarków Premium',
    description:
      'Butik zegarków premium w sercu Warszawy. Mokotowska 71 — kolekcja, serwis, skup, komis.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#faf9f7',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // W static export root layout nie zna locale (brak middleware). Każdy
  // locale-specific route renderuje własną sekcję z localized metadata, ale
  // sam <html lang> zostaje domyślny dla PL (główny rynek butiku).
  return (
    <html lang="pl" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <head>
        {/* Preconnect do CDN obrazów produktów — LCP win na karcie produktu. */}
        <link rel="preconnect" href="https://cdn.warszawskiczas.pl" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.warszawskiczas.pl" />
      </head>
      <body className="font-sans">
        <Suspense fallback={null}>
          <SessionTracker />
        </Suspense>
        <Suspense fallback={null}>
          <HtmlLangSync />
        </Suspense>
        {children}
        {/* Schema.org WebSite + Organization (uzupełnienie do LocalBusiness niżej) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://warszawskiczas.pl/#website',
              url: 'https://warszawskiczas.pl',
              name: 'Warszawski Czas',
              inLanguage: ['pl-PL', 'en-US', 'uk-UA'],
              publisher: { '@id': 'https://warszawskiczas.pl/#organization' },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://warszawskiczas.pl/#organization',
              name: 'Warszawski Czas',
              url: 'https://warszawskiczas.pl',
              logo: {
                '@type': 'ImageObject',
                url: 'https://warszawskiczas.pl/icon.png',
              },
              sameAs: [
                'https://www.instagram.com/warszawskiczas',
                'https://www.facebook.com/warszawskiczas',
              ],
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+48604501000',
                  contactType: 'customer service',
                  areaServed: 'PL',
                  availableLanguage: ['Polish', 'English', 'Ukrainian'],
                },
              ],
            }),
          }}
        />
        {/* 16.3 Schema.org LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['LocalBusiness', 'JewelryStore', 'Store'],
              '@id': 'https://warszawskiczas.pl/#localbusiness',
              name: 'Warszawski Czas',
              alternateName: 'Warszawski Czas — Butik Zegarków Premium',
              description:
                'Butik zegarków premium w sercu Warszawy. Ekskluzywna kolekcja zegarków, profesjonalny serwis zegarmistrzowski, skup i komis.',
              url: 'https://warszawskiczas.pl',
              telephone: '+48604501000',
              email: 'biuro@warszawskiczas.pl',
              image: 'https://warszawskiczas.pl/opengraph-image.jpg',
              logo: 'https://warszawskiczas.pl/icon.png',
              hasMap: 'https://www.google.com/maps?q=Mokotowska+71,+Warszawa',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'ul. Mokotowska 71',
                addressLocality: 'Warszawa',
                postalCode: '00-530',
                addressRegion: 'mazowieckie',
                addressCountry: 'PL',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 52.2207,
                longitude: 21.0177,
              },
              areaServed: [
                { '@type': 'City', name: 'Warszawa' },
                { '@type': 'Country', name: 'Polska' },
              ],
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '11:00', closes: '18:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '11:00', closes: '15:00' },
              ],
              priceRange: '$$$$',
              currenciesAccepted: 'PLN',
              paymentAccepted: 'Cash, Credit Card, Bank Transfer',
              sameAs: [
                'https://www.instagram.com/warszawskiczas',
                'https://www.facebook.com/warszawskiczas',
              ],
            })
          }}
        />
      </body>
    </html>
  )
}
