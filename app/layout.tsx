import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import { SessionTracker } from '@/components/session-tracker'
import { localeConfig, type Locale } from '@/lib/i18n'
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
    canonical: '/',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const requestHeaders = await headers()
  const locale = (requestHeaders.get('x-wc-locale') ?? 'pl') as Locale
  const htmlLang = localeConfig[locale]?.htmlLang ?? 'pl'

  return (
    <html lang={htmlLang} className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans">
        <Suspense fallback={null}>
          <SessionTracker />
        </Suspense>
        {children}
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
