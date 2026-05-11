import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { productsByBrand } from '@/lib/seo-product-filters'

const SLUG = 'zegarki-omega-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki Omega Warszawa — Speedmaster, Seamaster, Constellation, De Ville'
const DESCRIPTION =
  'Zegarki Omega w Warszawie. Speedmaster Moonwatch Professional, Seamaster Diver 300M, Aqua Terra, Constellation Manhattan, De Ville Prestige — używane i kolekcjonerskie egzemplarze, w komplecie z papierami, z 12 miesiącami gwarancji butiku. Mokotowska 71.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: localizedAlternates(`/${SLUG}`, 'pl'),
  openGraph: {
    type: 'website',
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  const products = productsByBrand('Omega', 6)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki Omega w Warszawie', serviceType: 'Sprzedaż zegarków Omega', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki Omega Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki Omega — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Omega · Warszawa"
        h1="Zegarki Omega w butiku Warszawski Czas"
        intro="Speedmaster Moonwatch Professional, Seamaster Diver 300M, Seamaster Aqua Terra, Constellation Manhattan, De Ville Prestige — pełne spektrum zegarków Omega w Warszawie. Egzemplarze współczesne i vintage, z papierami, z 12 miesiącami gwarancji butiku, dostępne od ręki oraz na zamówienie."
        primaryCtaLabel="Zapytaj o model Omega"
        source="landing-zegarki-omega"
        body={[
          {
            heading: 'Omega Warszawa — od Moonwatcha po Constellation',
            paragraphs: [
              'Omega to dziś jeden z najbardziej rozpoznawalnych szwajcarskich producentów zegarków, łączący historię (Speedmaster jako pierwszy zegarek na Księżycu w 1969 roku) ze współczesną technologią Master Chronometer Co-Axial i certyfikacją METAS. W Warszawie oferujemy szeroki wybór używanych zegarków Omega — od kultowego Speedmastera po elegancki Constellation i biżuteryjny De Ville.',
              'W ofercie Warszawskiego Czasu znajdziesz Omegi z różnych dekad: współczesne referencje 42 mm (Speedmaster Professional 310.30, Seamaster Diver 300M 210.30), klasyczne Constellation Manhattan 32.5 mm i 35 mm, a także starannie wyselekcjonowane egzemplarze vintage z lat 60.–80. Każdy zegarek przechodzi pełną weryfikację autentyczności, kontrolę mechanizmu i — w razie potrzeby — przegląd serwisowy w naszej pracowni.',
            ],
          },
          {
            heading: 'Najpopularniejsze linie Omegi w Warszawie',
            paragraphs: [
              'Omega Speedmaster — kultowy chronograf księżycowy, dostępny w wersjach Hesalite (310.30.42.50.01.001) i Sapphire Sandwich. Sprowadzamy też edycje limitowane jak Snoopy Award, Apollo 11 Anniversary, Silver Snoopy oraz egzemplarze vintage Pre-Moon (105.012, 145.012).',
              'Omega Seamaster — w segmencie sportowym Diver 300M w wariantach z czarną, niebieską, zieloną i białą tarczą, edycje James Bond („No Time To Die”), Planet Ocean 600M, Aqua Terra 38 mm i 41 mm w stalu i bicolor.',
              'Omega Constellation — biżuteryjna linia w stalu i bicolor, z mantle bezelem, indeksami diamentowymi i bransoletą half-Roman. Constellation Manhattan w rozmiarach 25, 28, 29, 32.5, 35 i 39 mm.',
              'Omega De Ville — Prestige (39.5 mm), Trésor, Hour Vision oraz vintage De Ville z lat 70. dla klientów ceniących elegancką klasykę.',
            ],
          },
        ]}
        highlights={[
          { title: 'Speedmaster Professional', description: 'Klasyk księżycowy Omegi — od współczesnych referencji 310.30 i 311.30 po vintage Pre-Moon z lat 60. i 70.' },
          { title: 'Seamaster Diver / Aqua Terra', description: 'Sportowo-elegancka linia z chronometrem Master Co-Axial, certyfikatem METAS i odpornością na pole magnetyczne 15 000 gauss.' },
          { title: 'Vintage Constellation i De Ville', description: 'Wybrane egzemplarze kolekcjonerskie z udokumentowanym pochodzeniem, papierami i pełną historią serwisową.' },
        ]}
        bulletsHeading="Co znajdziesz w ofercie Omega"
        bullets={[
          'Omega Speedmaster Moonwatch — Hesalite, Sapphire, Snoopy, Apollo 11, Silver Snoopy, Dark Side of the Moon',
          'Omega Seamaster Diver 300M — czarny, niebieski, zielony, James Bond „No Time To Die”',
          'Omega Seamaster Planet Ocean 600M, Aqua Terra 38/41 mm w stali i bicolor',
          'Omega Constellation Manhattan 25/28/29/32.5/35/39 mm — stal, bicolor, MOP, indeksy diamentowe',
          'Omega De Ville Prestige 39.5 mm, Trésor, Hour Vision i vintage De Ville z lat 70.',
          'Vintage Constellation Pie-Pan, Seamaster De Ville, Speedmaster Pre-Moon (105.012, 145.012)',
        ]}
        productPreview={{
          heading: 'Wybrane zegarki Omega z oferty',
          description: 'Egzemplarze dostępne od ręki w butiku przy Mokotowskiej 71. Pełną listę znajdziesz w katalogu.',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        stepsHeading="Jak kupić Omegę w Warszawie"
        steps={[
          { title: 'Wybór', description: 'Z katalogu albo zlecenie sprowadzenia konkretnej referencji Omega.' },
          { title: 'Weryfikacja', description: 'Mechanizm, oznaczenia, pomiary chronometryczne, historia serwisu Omega.' },
          { title: 'Prezentacja', description: 'Spotkanie w butiku albo wideo + zdjęcia 360° i wysyłka kurierem.' },
          { title: 'Gwarancja', description: 'Certyfikat butiku i 12 miesięcy gwarancji butiku Warszawski Czas.' },
        ]}
        faq={[
          { q: 'Czy macie używane Omegi Speedmaster w Warszawie?', a: 'Tak. W stałej ofercie znajdują się Speedmastery Professional Hesalite i Sapphire, a także starannie wybrane egzemplarze Pre-Moon. Sprowadzamy też edycje limitowane na zamówienie.' },
          { q: 'Czy oferujecie serwis i przegląd zegarków Omega?', a: 'Tak. W naszej pracowni zegarmistrzowskiej wykonujemy przegląd Omega, regulacje, wymianę uszczelek i pełny serwis mechanizmu Co-Axial.' },
          { q: 'Czym różni się Speedmaster Hesalite od Sapphire?', a: 'Hesalite zachowuje oryginalny szkło z misji księżycowych Apollo (lekkie, plastyczne, łatwo polerowalne). Sapphire to wersja ze szkłem szafirowym — bardziej odporna na zarysowania, ale cięższa i z innym charakterem optycznym tarczy.' },
          { q: 'Czy każda Omega ma 12 miesięcy gwarancji butiku?', a: 'Tak — niezależnie od pozostałej gwarancji Omega każdy zegarek otrzymuje 12 miesięcy gwarancji Warszawskiego Czasu na pracę mechanizmu.' },
        ]}
        closingHeading="Zapytaj o swoją Omegę"
        closingText="Speedmaster, Seamaster, Constellation, De Ville — od ręki w Warszawie albo na zamówienie."
        relatedLinks={[
          { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe' },
          { href: '/chronografy-warszawa', label: 'Chronografy' },
          { href: '/zegarki-sportowe-warszawa', label: 'Zegarki sportowe' },
          { href: '/zegarki-kolekcjonerskie', label: 'Zegarki kolekcjonerskie' },
        ]}
      />
    </>
  )
}
