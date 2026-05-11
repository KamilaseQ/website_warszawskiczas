import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { chronographWatches } from '@/lib/seo-product-filters'

const SLUG = 'chronografy-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Chronografy Warszawa — Daytona, Speedmaster, Royal Oak Chronograph'
const DESCRIPTION =
  'Chronografy luksusowe w Warszawie — Rolex Daytona, Omega Speedmaster, Audemars Piguet Royal Oak Chronograph, Patek Philippe 5980, IWC Portugieser Chronograph, Breitling Chronomat. Z certyfikatem autentyczności i 12 m-cy gwarancji.'

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
    images: [{ url: 'https://warszawskiczas.pl/Patek Philippe Nautilus-12.jpg', alt: 'Chronografy luksusowe — Warszawski Czas' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  const products = chronographWatches(6)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Chronografy luksusowe w Warszawie', serviceType: 'Sprzedaż chronografów', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Chronografy Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Chronografy — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Chronografy · Komplikacje"
        h1="Chronografy luksusowe — Warszawa"
        intro="Najsłynniejsze chronografy świata w butiku Warszawski Czas: Rolex Daytona (116500LN, 116503, 126500LN), Omega Speedmaster Moonwatch Professional, Audemars Piguet Royal Oak Chronograph (26331ST, 26240ST), Patek Philippe Nautilus 5980 i Aquanaut 5968, IWC Portugieser Chronograph i Pilot Chronograph, Breitling Chronomat i Navitimer, Zenith El Primero, TAG Heuer Carrera i Monaco. Mechanizmy automatyczne i ręcznie nakręcane, w stalu, złocie i tytanie."
        primaryCtaLabel="Zobacz chronografy"
        source="landing-chronografy"
        body={[
          {
            heading: 'Chronograf — funkcja, która zmieniła zegarmistrzostwo',
            paragraphs: [
              'Chronograf to komplikacja zegarmistrzowska pozwalająca mierzyć krótkie odcinki czasu — najczęściej z dokładnością do 1/8 sekundy (przy mechanizmach 28 800 vph) lub 1/10 sekundy (Zenith El Primero, 36 000 vph). Pierwsze chronografy mechaniczne pojawiły się na początku XIX wieku, ale współczesny standard wyznaczyły lata 60. — gdy zegarmistrze rozwiązali problem zintegrowania chronografu z automatycznym naciągiem (Zenith El Primero, Heuer Calibre 11, Seiko 6139).',
              'Dziś chronograf jest jedną z najpopularniejszych komplikacji w segmencie luksusowym. Najbardziej rozpoznawalne modele to Rolex Daytona (zaprojektowany dla wyścigów sportowych), Omega Speedmaster (pierwszy zegarek na Księżycu, NASA Mission), Audemars Piguet Royal Oak Chronograph i Patek Philippe Nautilus 5980. Każdy z nich łączy precyzję mechanizmu z ikonicznym designem koperty.',
            ],
          },
          {
            heading: 'Rodzaje mechanizmów chronograficznych',
            paragraphs: [
              'Chronograf z kołem kolumnowym (column wheel) — bardziej zaawansowany, gładsze przełączanie, wyższe koszty produkcji. Charakterystyczny dla manufaktur: Rolex Cal. 4130 (Daytona), Patek CH 28-520, Audemars Piguet Cal. 2385/2326, Zenith El Primero 400.',
              'Chronograf z dźwignią koordynującą (cam-coordinated) — prostszy konstrukcyjnie, twardsze przełączanie, niższe koszty. Standardowo w segmencie ETA Valjoux 7750 i jego pochodnych (Breitling, IWC podstawowe modele).',
              'Chronograf flyback (powrotny) — pozwala zatrzymać, zresetować i wystartować chronograf jednym wciśnięciem przycisku. Przydatne w lotnictwie. IWC Portugieser, Breitling Navitimer, Patek 5170.',
              'Chronograf rattrapante (split-second) — z dwiema centralnymi sekundami pozwalającymi mierzyć dwa równoległe interwały. Najbardziej zaawansowana komplikacja chronografu — Patek Philippe 5370P, Audemars Piguet Code 11.59 RD#3, Vacheron Constantin Harmony.',
            ],
          },
        ]}
        highlights={[
          { title: 'Rolex Daytona', description: 'Najsłynniejszy stalowy chronograf świata. 116500LN ceramic bezel, 126500LN, Le Mans 126529LN, edycje meteorytowe.' },
          { title: 'Omega Speedmaster', description: 'Moonwatch Professional Hesalite/Sapphire, edycje Snoopy, Apollo, Silver Snoopy. Mechanizm Cal. 3861 z certyfikatem METAS.' },
          { title: 'AP Royal Oak Chronograph', description: 'Royal Oak Chronograph 41 mm (26331ST/OR), Royal Oak 38 mm Chronograph (26240ST), Royal Oak Offshore Chronograph 26420.' },
        ]}
        bulletsHeading="Chronografy najczęściej w obrocie"
        bullets={[
          'Rolex Daytona 116500LN, 116503 (Rolesor), 126500LN, Daytona „Le Mans” 126529LN',
          'Omega Speedmaster Moonwatch Professional 310.30.42.50.01.001 (Hesalite) i 310.30.42.50.01.002 (Sapphire)',
          'Audemars Piguet Royal Oak Chronograph 26331ST/OR i 26240ST, Royal Oak Offshore Chronograph 26470/26420',
          'Patek Philippe Nautilus 5980, Aquanaut Chronograph 5968, Calatrava Pilot 5524, Annual Calendar Chronograph 5961',
          'IWC Portugieser Chronograph 3714, Pilot Chronograph 3777, Big Pilot Top Gun, Portugieser Perpetual Calendar Chronograph',
          'Breitling Chronomat B01 42, Navitimer B01 Chronograph 43, Superocean Heritage Chronograph, Premier B01',
          'Zenith El Primero Chronomaster, Defy Skyline Skeleton, Chronomaster Sport',
          'TAG Heuer Carrera, Monaco, Autavia, Aquaracer Chronograph',
          'Franck Muller Vanguard Chronograph, Long Island Chronograph',
        ]}
        productPreview={{
          heading: 'Chronografy z aktualnej oferty',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        faq={[
          { q: 'Czym różni się Daytona od Speedmastera?', a: 'Daytona to chronograf z mechanizmem automatycznym (Cal. 4130) i bezelem tachymetrycznym, zaprojektowany dla wyścigów sportowych. Speedmaster Professional ma mechanizm ręcznie nakręcany (Cal. 3861) i jest zegarkiem księżycowym NASA. Ceny i kultura wokół obu modeli są bardzo różne — Daytona jest dziś bardziej luksusowo-sportowa, Speedmaster zachowuje narzędziowy, historyczny charakter.' },
          { q: 'Jak często serwisować chronograf?', a: 'Producent zwykle zaleca pełny serwis chronografu co 5–7 lat. Mechanizm chronografu ma więcej elementów ruchomych niż zwykły automat, więc smarowanie i regulacja są krytyczne dla precyzji.' },
          { q: 'Czy używać chronografu codziennie?', a: 'Tak, ale z umiarem — częste resetowanie chronografu skraca okres pomiędzy serwisami. Producenci zalecają, by nie resetować chronografu przy aktywnej funkcji (zatrzymać → zresetować → wystartować, nie wszystko jednocześnie).' },
        ]}
        closingHeading="Zapytaj o chronograf"
        closingText="Daytona, Speedmaster, Royal Oak Chronograph, Nautilus 5980, Portugieser, Chronomat, El Primero — w stałej ofercie i na zamówienie."
        relatedLinks={[
          { href: '/zegarki-sportowe-warszawa', label: 'Zegarki sportowe' },
          { href: '/zegarki-rolex-warszawa', label: 'Zegarki Rolex' },
          { href: '/zegarki-omega-warszawa', label: 'Zegarki Omega' },
          { href: '/zegarki-audemars-piguet-warszawa', label: 'Zegarki Audemars Piguet' },
          { href: '/zegarki-iwc-warszawa', label: 'Zegarki IWC' },
        ]}
      />
    </>
  )
}
