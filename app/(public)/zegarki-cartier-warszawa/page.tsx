import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { productsByBrand } from '@/lib/seo-product-filters'

const SLUG = 'zegarki-cartier-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki Cartier Warszawa — Tank, Santos, Panthère, Ballon Bleu, Baignoire'
const DESCRIPTION =
  'Zegarki Cartier w Warszawie. Tank Louis, Tank Française, Santos de Cartier, Panthère, Ballon Bleu, Baignoire — modele dla niej i dla niego, w stali, złocie żółtym, różowym i białym, z diamentami. Z gwarancją autentyczności butiku.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: localizedAlternates(`/${SLUG}`, 'pl'),
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, siteName: 'Warszawski Czas', locale: 'pl_PL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  const products = productsByBrand('Cartier', 6)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki Cartier w Warszawie', serviceType: 'Sprzedaż zegarków Cartier', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki Cartier Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki Cartier — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Cartier · Warszawa"
        h1="Zegarki Cartier dla niej i dla niego — Warszawa"
        intro="Tank Louis Cartier, Tank Française, Tank Must, Santos de Cartier, Santos-Dumont, Panthère, Ballon Bleu, Baignoire i Pasha — kultowe linie Cartiera w butiku przy Mokotowskiej 71. Egzemplarze damskie, męskie i unisex, w stali, w 18K złocie żółtym, różowym i białym, z bezelami diamentowymi i bez. Sprowadzimy też konkretną referencję Cartier na zamówienie."
        primaryCtaLabel="Zapytaj o Cartiera"
        source="landing-zegarki-cartier"
        body={[
          {
            heading: 'Cartier — biżuteryjna szwajcarsko-paryska szkoła zegarmistrzostwa',
            paragraphs: [
              'Cartier od ponad stu lat łączy paryską estetykę biżuterii z genewskim zegarmistrzostwem. Tank, zaprojektowany przez Louisa Cartiera w 1917 roku z inspiracji wojskowymi czołgami Renault FT, jest dziś jednym z najbardziej rozpoznawalnych kształtów koperty w historii zegarków. Santos, z 1904 roku, to z kolei pierwszy nowoczesny męski zegarek na rękę — stworzony dla brazylijskiego pioniera lotnictwa Alberto Santos-Dumonta.',
              'W Warszawie oferujemy szeroki wybór używanych zegarków Cartier — od współczesnych referencji w stalu (Santos Medium WSSA0009, Tank Must WSTA0041) po klasyczne modele w 18K złocie żółtym i różowym oraz egzemplarze z bezelami diamentowymi. Każdy Cartier w butiku jest weryfikowany pod kątem autentyczności, mechanizmu, kompletu papierów i pochodzenia.',
            ],
          },
          {
            heading: 'Cartier dla niej, dla niego, dla obojga',
            paragraphs: [
              'Tank — prostokątna koperta, biała tarcza, niebieskie wskazówki Breguet, charakterystyczne brewy. Tank Louis Cartier (skórzany pasek), Tank Française (bransoleta zintegrowana), Tank Must (różne tarcze, w tym czerwone, niebieskie i zielone), Tank Américaine (wydłużona, lekko wybrzuszona).',
              'Santos de Cartier — koperta z widocznymi śrubami koperty i bransoleta z systemem QuickSwitch (szybka wymiana paska). Wersje Medium 35 mm i Large 39.8 mm w stalu, bicolor i pełnym 18K złocie żółtym oraz różowym.',
              'Panthère de Cartier — biżuteryjna linia damska i unisex w stalu i 18K złocie. Rozmiary Small (22 mm), Medium (27 mm), Large (37 mm) — często z bezelami diamentowymi.',
              'Ballon Bleu de Cartier — okrągła koperta z charakterystyczną „bańką” korony chronionej szafirem. Rozmiary 28, 33, 36, 40, 42 mm w stalu, bicolor i pełnym złocie.',
              'Baignoire — owalna koperta inspirowana wanną (fr. „baignoire”). Klasyczna linia damska Cartiera, dostępna w wersjach Mini, Small i Allongée, w 18K złocie żółtym, różowym i białym, z diamentami i bez.',
            ],
          },
        ]}
        highlights={[
          { title: 'Tank Louis / Tank Must', description: 'Klasyczna prostokątna linia Cartiera — biała tarcza, niebieskie wskazówki Breguet, w stalu, 18K złocie żółtym i różowym, z diamentami.' },
          { title: 'Santos / Santos-Dumont', description: 'Sportowo-elegancka koperta z widocznymi śrubami i systemem QuickSwitch — symbol art déco Cartiera od 1904 roku.' },
          { title: 'Panthère / Ballon Bleu / Baignoire', description: 'Linie damskie i unisex w stalu, 18K złocie żółtym, różowym i białym, często z bezelami i indeksami diamentowymi.' },
        ]}
        bulletsHeading="Modele Cartier najczęściej w obrocie"
        bullets={[
          'Tank Louis Cartier — pasek skórzany, koperta 18K złoto żółte/różowe, kaliber ręcznie nakręcany',
          'Tank Française — bransoleta zintegrowana, stal i bicolor, rozmiary Small i Medium',
          'Tank Must — quartz/automat, tarcze niebieska, czerwona, zielona, biała',
          'Santos de Cartier — Medium 35 mm i Large 39.8 mm, stal, bicolor, 18K żółte i różowe złoto',
          'Santos-Dumont — Small, Large, XL — koperta cienka, kalibry ręcznie nakręcane',
          'Panthère de Cartier — Small/Medium/Large, stal, 18K żółte/różowe złoto, indeksy diamentowe',
          'Ballon Bleu de Cartier — 33/36/40/42 mm, stal, bicolor, 18K złoto żółte/różowe',
          'Baignoire — Mini/Allongée, 18K złoto, diamenty',
        ]}
        productPreview={{
          heading: 'Cartier z aktualnej oferty butiku',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        stepsHeading="Jak kupić Cartiera w Warszawie"
        steps={[
          { title: 'Wybór', description: 'Z katalogu albo zlecenie poszukiwania konkretnej referencji Cartier.' },
          { title: 'Weryfikacja', description: 'Pełna kontrola autentyczności, stanu, kompletu papierów i pudełka.' },
          { title: 'Prezentacja', description: 'Wizyta w butiku — pasek lub bransoleta do wymiany na życzenie (system QuickSwitch).' },
          { title: 'Gwarancja', description: 'Certyfikat butiku i 12 miesięcy gwarancji butiku Warszawski Czas.' },
        ]}
        faq={[
          { q: 'Jaki Cartier wybrać dla kobiety?', a: 'Najczęściej polecamy Tank Must i Tank Française w rozmiarze Small (klasyka), Panthère Small lub Medium (biżuteryjna stylistyka) oraz Ballon Bleu 33 mm. Klientki ceniące dyskrecję wybierają Baignoire w 18K złocie.' },
          { q: 'Jaki Cartier dla mężczyzny?', a: 'Najpopularniejsze są Santos de Cartier Large 39.8 mm (sportowo-elegancki), Tank Française Large i Ballon Bleu 42 mm. Dla klientów ceniących klasykę — Tank Louis Cartier Large w 18K złocie różowym.' },
          { q: 'Czy każdy Cartier ma papiery?', a: 'Większość naszych Cartierów ma karty i pudełko. Egzemplarze bez kompletu oznaczamy wyraźnie i wyceniamy odpowiednio niżej.' },
          { q: 'Czy oferujecie skup zegarków Cartier?', a: 'Tak — skupujemy używane Cartiery wszystkich linii. Wstępna wycena po zdjęciach w 15 minut, finalizacja w butiku.' },
        ]}
        closingHeading="Zapytaj o swój model Cartier"
        closingText="Tank, Santos, Panthère, Ballon Bleu, Baignoire — sprowadzimy konkretną referencję."
        relatedLinks={[
          { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe' },
          { href: '/zegarki-damskie-warszawa', label: 'Zegarki damskie' },
          { href: '/zegarki-z-diamentami-warszawa', label: 'Zegarki z diamentami' },
          { href: '/zegarki-ze-zlota-warszawa', label: 'Zegarki ze złota' },
        ]}
      />
    </>
  )
}
