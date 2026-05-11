import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { goldWatches } from '@/lib/seo-product-filters'

const SLUG = 'zegarki-ze-zlota-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki ze złota Warszawa — żółte, różowe, białe 18K | Warszawski Czas'
const DESCRIPTION =
  'Złote zegarki w Warszawie — Rolex Day-Date, Patek Philippe Calatrava, Cartier Tank, Audemars Piguet Royal Oak. 18K złoto żółte, różowe (Everose), białe i bicolor. Z gwarancją autentyczności i dokumentacją pochodzenia.'

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
    images: [{ url: 'https://warszawskiczas.pl/patek.jpg', alt: 'Złote zegarki — Warszawski Czas, Mokotowska 71' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/patek.jpg'] },
}

export default function Page() {
  const products = goldWatches(6)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki ze złota w Warszawie', serviceType: 'Sprzedaż złotych zegarków', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki ze złota Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Złote zegarki — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Złoto · 18K · Warszawa"
        h1="Zegarki ze złota — żółte, różowe, białe 18K"
        intro="Najpiękniejsze zegarki w 18-karatowym złocie żółtym, różowym (Everose), białym oraz w wersjach bicolor (stal-złoto i Rolesor). Rolex Day-Date i Datejust w pełnym złocie, Patek Philippe Calatrava i Annual Calendar, Audemars Piguet Royal Oak w żółtym i różowym złocie, Cartier Tank Louis Cartier i Santos w 18K, Omega Constellation bicolor — najszerszy wybór złotych zegarków w Warszawie."
        primaryCtaLabel="Zobacz złote zegarki"
        source="landing-zegarki-ze-zlota"
        heroImage={{ src: '/patek.jpg', alt: 'Patek Philippe w złocie — butik Warszawski Czas' }}
        body={[
          {
            heading: 'Złote zegarki w Warszawie — żółte, różowe, białe i bicolor',
            paragraphs: [
              'Złoto w zegarmistrzostwie luksusowym oznacza zwykle stop 18K (750/1000) — twardszy i odporniejszy niż 24K, ale nadal wyraźnie cieplejszy w odbiorze niż stal. Najpopularniejsze warianty to złoto żółte (klasyka, najbardziej widoczna obecność metalu szlachetnego), złoto różowe (Everose u Rolexa, Sundust w wersjach Datejust 41) i złoto białe (eleganckie, dyskretne, często mylone optycznie ze stalą lub platyną).',
              'W butiku Warszawski Czas znajdziesz pełne spektrum złotych zegarków — od kompletnie złotych Rolex Day-Date Presidentów po biżuteryjne Cartier Panthère w 18K, oraz wersje bicolor i Rolesor (stalowo-złote, częściej spotykane w segmencie Datejust 36/41 i Submariner 126613). Każdy złoty zegarek przechodzi pełną weryfikację autentyczności, kontrolę pochodzenia złota i — jeśli wymaga — przegląd serwisowy w naszej pracowni.',
            ],
          },
          {
            heading: 'Co warto wiedzieć kupując złoty zegarek',
            paragraphs: [
              'Wartość złotego zegarka składa się z kilku elementów: marki i modelu, wagi i czystości złota (18K = 75% złota czystego), stanu koperty i bransolety, kompletu dokumentów i pudełka oraz historii serwisowej. W przypadku Rolexów i Patek Philippe sama wartość metalu szlachetnego stanowi typowo 15–35% ceny rynkowej — pozostała część to wartość marki, mechanizmu i historii.',
              'Złoto w zegarkach klasy premium jest też dziś inwestycją: ceny złotych Rolex Day-Date i Patek Philippe Calatrava w 18K rosną szybciej niż ich stalowe odpowiedniki (z wyjątkiem segmentu sport-stal, gdzie Daytona, Submariner i Royal Oak ST notują własną dynamikę). Cartier Tank w 18K złocie różowym stał się jednym z najszybciej zyskujących na wartości modeli ostatnich lat.',
            ],
          },
        ]}
        highlights={[
          { title: 'Złoto żółte 18K', description: 'Klasyczne pełne złoto żółte: Rolex Day-Date 228238, Cartier Tank Louis Cartier, Patek Calatrava 6119J, Audemars Piguet Royal Oak żółte złoto.' },
          { title: 'Złoto różowe / Everose', description: 'Cieplejsza, biżuteryjna wersja: Rolex Datejust 41 Everose Sundust, Day-Date 228235, Patek Annual Calendar w 18K różowym, Cartier Santos różowe złoto.' },
          { title: 'Złoto białe i bicolor', description: 'Dyskretna elegancja białego 18K oraz wersje Rolesor (stal-złoto): Rolex Datejust 41 Rolesor, Submariner 126613, Cartier Tank Française bicolor.' },
        ]}
        bulletsHeading="Złote modele najczęściej w ofercie"
        bullets={[
          'Rolex Day-Date 36 i 40 — pełne 18K żółte, różowe (Everose), białe, platyna i Tridor (3 kolory złota)',
          'Rolex Datejust 36 i 41 — Rolesor żółty/Everose, pełne 18K złoto, tarcze MOP i diamentowe',
          'Patek Philippe Calatrava 6119J/R, Annual Calendar 5396 i 5396R, Twenty~4 Automatic',
          'Audemars Piguet Royal Oak 15500BA, 15510OR, 15400OR — żółte i różowe złoto',
          'Cartier Tank Louis Cartier i Santos w 18K złocie żółtym i różowym',
          'Omega Constellation bicolor i Constellation 18K, De Ville Prestige bicolor',
          'Chopard Happy Sport, L.U.C i Mille Miglia w 18K złocie',
          'Vacheron Constantin Overseas i Patrimony w 18K różowym złocie',
        ]}
        productPreview={{
          heading: 'Złote zegarki z aktualnej oferty',
          description: 'Egzemplarze w 18K złocie i wersjach bicolor — Rolex, Patek, Cartier, Omega, Chopard.',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        stepsHeading="Jak kupić złoty zegarek"
        steps={[
          { title: 'Wybór', description: 'Z katalogu albo zlecenie sprowadzenia konkretnej referencji w 18K złocie.' },
          { title: 'Weryfikacja', description: 'Kontrola próby złota, mechanizmu, oznaczeń i dokumentów pochodzenia.' },
          { title: 'Prezentacja', description: 'Spotkanie w butiku — przymiarka, ocena ciężaru i wykończenia.' },
          { title: 'Finalizacja', description: 'Certyfikat butiku, 12 miesięcy gwarancji, faktura.' },
        ]}
        faq={[
          { q: 'Czym różni się złoto Everose od zwykłego różowego złota?', a: 'Everose to opatentowany przez Rolexa stop 18K złota różowego (76% złota, 22% miedzi, 2% platyny). Dodatek platyny stabilizuje kolor i zapobiega blaknięciu z czasem. „Zwykłe” złoto różowe innych marek (np. 5N) z czasem jaśnieje pod wpływem chloru i kosmetyków.' },
          { q: 'Co to jest Rolesor?', a: 'Rolesor to nazwa Rolexa dla wersji bicolor — stal Oystersteel (904L) z elementami z 18K złota żółtego (Rolesor żółty), Everose (Rolesor Everose) lub białego (Rolesor biały). Najczęściej spotykany w Datejust, Submariner Date i GMT-Master II Root Beer.' },
          { q: 'Czy złote zegarki są inwestycją?', a: 'Tak, ale z zastrzeżeniami. Wartość złotych zegarków premium rośnie zwykle wolniej niż ceny złota fizycznego, ale szybciej niż depozyty bankowe. Najszybciej zyskują złote Patek Philippe i klasyczny Cartier Tank w 18K. Nie należy kupować zegarka jako pure investment — zysk pojawia się w 5–10 letnim horyzoncie.' },
          { q: 'Czy można sprzedać złoty zegarek w skupie u Was?', a: 'Tak. Wstępna wycena po zdjęciach w 15 minut, finalizacja w butiku tego samego dnia gotówką lub przelewem.' },
        ]}
        closingHeading="Wybierz złoty zegarek"
        closingText="Pełne 18K złoto, Everose, białe lub bicolor — Rolex, Patek, Cartier, AP, Omega."
        relatedLinks={[
          { href: '/zegarki-z-diamentami-warszawa', label: 'Zegarki z diamentami' },
          { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe' },
          { href: '/zegarki-rolex-warszawa', label: 'Zegarki Rolex' },
          { href: '/zegarki-cartier-warszawa', label: 'Zegarki Cartier' },
          { href: '/zegarki-patek-philippe-warszawa', label: 'Zegarki Patek Philippe' },
        ]}
      />
    </>
  )
}
