import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { diamondWatches } from '@/lib/seo-product-filters'

const SLUG = 'zegarki-z-diamentami-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki z diamentami Warszawa — bezel diamentowy, indeksy, iced out'
const DESCRIPTION =
  'Zegarki z diamentami w Warszawie — Rolex Datejust z bezelem diamentowym, Cartier Panthère i Tank z brylantami, Chopard Happy Sport, Patek Philippe Twenty~4, Bvlgari z diamentami. Wersje fabryczne i custom iced out z certyfikatem.'

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
    images: [{ url: 'https://warszawskiczas.pl/chopard.jpg', alt: 'Zegarki z diamentami — butik Warszawski Czas' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/chopard.jpg'] },
}

export default function Page() {
  const products = diamondWatches(6)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki z diamentami w Warszawie', serviceType: 'Sprzedaż zegarków z diamentami', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki z diamentami Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki z diamentami — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Diamenty · Brylanty"
        h1="Zegarki z diamentami — Warszawa"
        intro="Zegarki z diamentami w wersjach fabrycznych i custom iced out: Rolex Datejust z bezelem diamentowym, Cartier Panthère i Tank z indeksami brylantowymi, Chopard Happy Sport z ruchomymi diamentami, Patek Philippe Twenty~4, Bvlgari Bvlgari Bvlgari, Audemars Piguet Royal Oak frosted gold. Wszystkie egzemplarze z certyfikatem autentyczności i wyceną diamentów."
        primaryCtaLabel="Zobacz zegarki z diamentami"
        source="landing-zegarki-z-diamentami"
        heroImage={{ src: '/chopard.jpg', alt: 'Chopard z diamentami — Warszawski Czas' }}
        body={[
          {
            heading: 'Diamentowe zegarki — fabryczne, after-market i custom iced out',
            paragraphs: [
              'W obrocie luksusowymi zegarkami z diamentami spotykamy trzy kategorie egzemplarzy. Pierwsza to wersje fabryczne — diamenty osadzone przez producenta jako standardowa konfiguracja danej referencji (Rolex Datejust 178384 z fabrycznym bezelem diamentowym, Cartier Tank z indeksami brylantowymi, Patek Philippe Twenty~4 5910). Te modele zachowują pełną wartość rynkową i są najlepsze pod kątem inwestycyjnym.',
              'Druga kategoria to wersje after-market — diamenty osadzone przez wyspecjalizowany warsztat już po zakupie zegarka, najczęściej w bezel, lugs, koronę lub bransoletę. Wartość rynkowa takiego zegarka jest niższa od fabrycznej wersji diamentowej, ale wyższa niż egzemplarza bez diamentów. Należy zachować ostrożność przy zakupie — szczególnie ważna jest weryfikacja jakości osadzenia i jakości samych kamieni (czystość, kolor, masa).',
              'Trzecia, najszersza kategoria w segmencie luksusowym, to custom iced out — kompleksowe pokrycie zegarka diamentami (koperta, bezel, bransoleta, tarcza). Cartier Santos w wersji iced out, Rolex Datejust z arabską tarczą diamentową — to popularne customizacje. W każdym przypadku oferujemy pełną dokumentację: liczba diamentów, masa karatowa, czystość i kolor, wycenę GIA-poziomu.',
            ],
          },
          {
            heading: 'Co warto wiedzieć o diamentach w zegarkach',
            paragraphs: [
              'W zegarkach klasy premium używa się typowo diamentów w klasach G–H (kolor, near-colorless) i czystości VS1–VS2 (very small inclusions, niewidoczne gołym okiem). Tańsze egzemplarze mogą zawierać diamenty I-J / SI1–SI2, ale klienci ceniący jakość zwykle wybierają G/VS lub lepsze.',
              'Łączna masa karatowa diamentów w zegarku waha się od 0.3 ct (subtelne indeksy w Cartier Panthère) do nawet 30+ ct w pełnej wersji iced out. Rolex Datejust 36 z fabrycznym bezelem diamentowym ma typowo ~0.8 ct, Audemars Piguet Royal Oak Diamond Bezel — ok. 1.6 ct.',
              'W naszej ofercie każdy diamentowy zegarek otrzymuje krótki dokument butiku z opisem osadzenia, liczbą diamentów, łączną masą karatową i klasą czystości. Pomaga to przy późniejszej sprzedaży lub ubezpieczeniu zegarka.',
            ],
          },
        ]}
        highlights={[
          { title: 'Fabryczne wersje diamentowe', description: 'Rolex Datejust 178384, Cartier Tank z indeksami brylantowymi, Patek Twenty~4, AP Royal Oak Diamond Bezel.' },
          { title: 'Custom iced out', description: 'Rolex Datejust iced out z arabską tarczą, Cartier Santos iced out, Audemars Piguet w pełnym osadzeniu diamentowym.' },
          { title: 'Damska biżuteryjna', description: 'Cartier Panthère Small i Medium z diamentami, Chopard Happy Sport z ruchomymi diamentami, Bvlgari Bvlgari Bvlgari.' },
        ]}
        bulletsHeading="Najczęstsze konfiguracje diamentowe"
        bullets={[
          'Rolex Datejust 36 i 41 z fabrycznym bezelem diamentowym i tarczą MOP / diamentową',
          'Rolex Day-Date z bezelem diamentowym i tarczą Mother of Pearl z indeksami brylantowymi',
          'Cartier Panthère Small i Medium z bezelem diamentowym, w 18K złocie żółtym i białym',
          'Cartier Tank Américaine i Tank Française z bezelem i indeksami diamentowymi',
          'Patek Philippe Twenty~4 5910 i Calatrava 4960G z bezelem diamentowym',
          'Audemars Piguet Royal Oak 15400 Diamond Bezel, 15451 Frosted Gold',
          'Chopard Happy Sport z 7 ruchomymi diamentami, L.U.C z bezelem diamentowym',
          'Bvlgari Bvlgari Bvlgari, Diva’s Dream, Serpenti — biżuteryjne wersje z brylantami',
        ]}
        productPreview={{
          heading: 'Zegarki z diamentami — wybrane egzemplarze',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        faq={[
          { q: 'Skąd wiadomo, że diamenty w zegarku są oryginalne?', a: 'Diamenty w zegarkach klasy premium weryfikujemy testem termicznym (rozproszenie ciepła) oraz pod lupą jubilerską 10×. Dla custom-osadzonych egzemplarzy oferujemy też niezależną ekspertyzę gemmologiczną na życzenie klienta.' },
          { q: 'Czy fabryczna wersja diamentowa traci na wartości?', a: 'Nie — fabryczne wersje diamentowe Rolex, Patek Philippe, AP i Cartier zwykle zyskują wartość proporcjonalnie do reszty kolekcji marki. Wersje after-market i custom iced out tracą pewną premię względem fabryki, ale zachowują wartość samego materiału (diamenty + złoto).' },
          { q: 'Jakie diamenty stosujecie w wycenach?', a: 'W naszych dokumentach przedstawiamy klasę kolor i czystość zgodnie ze standardami GIA: kolor D–H (najczęściej G–H), czystość VVS1–VS2 (najczęściej VS).' },
        ]}
        closingHeading="Wybierz zegarek z diamentami"
        relatedLinks={[
          { href: '/zegarki-ze-zlota-warszawa', label: 'Zegarki ze złota' },
          { href: '/zegarki-damskie-warszawa', label: 'Zegarki damskie' },
          { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe' },
          { href: '/zegarki-cartier-warszawa', label: 'Zegarki Cartier' },
        ]}
      />
    </>
  )
}
