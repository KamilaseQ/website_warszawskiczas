import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'audemars-piguet-na-zamowienie'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Audemars Piguet na zamówienie — Royal Oak, Offshore, Code 11.59'
const DESCRIPTION =
  'Audemars Piguet na zamówienie. Royal Oak 15500/15510/15400, Royal Oak Offshore, Code 11.59 — sourcing konkretnej referencji, weryfikacja autentyczności, sprzedaż w butiku.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: localizedAlternates(`/${SLUG}`, 'pl'),
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, siteName: 'Warszawski Czas', locale: 'pl_PL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Audemars Piguet na zamówienie', serviceType: 'Sprowadzanie zegarków AP', description: DESCRIPTION, url: URL, areaServed: 'Polska' })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Audemars Piguet na zamówienie')) }} />
      <SeoLanding
        eyebrow="Audemars Piguet · Na zamówienie"
        h1="Audemars Piguet — Royal Oak, Offshore, Code 11.59"
        intro="Audemars Piguet Royal Oak to dziś jeden z najtrudniej dostępnych zegarków świata. Sprowadzamy konkretne referencje na zamówienie z weryfikacją autentyczności i pełną dokumentacją."
        primaryCtaLabel="Zleć poszukiwanie AP"
        source="landing-ap-na-zamowienie"
        highlights={[
          { title: 'Royal Oak', description: '15500ST, 15510ST, 15400ST, 15202ST, Jumbo Extra-Thin — sourcing referencji stalowych i złotych.' },
          { title: 'Royal Oak Offshore', description: 'Sportowa linia offshore — chronografy 42 mm i 44 mm, ceramic, forged carbon.' },
          { title: 'Code 11.59', description: 'Nowa linia dress watch AP — chronografy, perpetual calendar, automatic.' },
        ]}
        bulletsHeading="Konkretne referencje"
        bullets={[
          'Royal Oak Selfwinding 15500ST, 15510ST',
          'Royal Oak Selfwinding 15400ST („supersize”)',
          'Royal Oak Jumbo Extra-Thin 15202ST/16202ST',
          'Royal Oak Offshore 26470ST, 26420, „Diver”',
          'Code 11.59 Automatic, Chronograph, Perpetual Calendar',
        ]}
        stepsHeading="Proces"
        steps={[
          { title: 'Brief', description: 'Referencja, tarcza, rok, komplet, budżet.' },
          { title: 'Poszukiwanie', description: 'Sieć dostawców i kolekcjonerów w Europie.' },
          { title: 'Weryfikacja', description: 'Autentyczność, historia serwisu, zgodność oznaczeń.' },
          { title: 'Finalizacja', description: 'Spotkanie w butiku — akceptacja, transakcja, gwarancja.' },
        ]}
        closingHeading="Porozmawiajmy o konkretnym AP"
        relatedLinks={[
          { href: '/zegarki-na-zamowienie', label: 'Zegarki na zamówienie' },
          { href: '/rolex-na-zamowienie', label: 'Rolex na zamówienie' },
          { href: '/zegarki-kolekcjonerskie', label: 'Zegarki kolekcjonerskie' },
        ]}
      />
    </>
  )
}
