import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { ladiesWatches } from '@/lib/seo-product-filters'

const SLUG = 'zegarki-damskie-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki damskie luksusowe Warszawa — Cartier Panthère, Rolex Lady-Datejust'
const DESCRIPTION =
  'Damskie zegarki luksusowe w Warszawie — Cartier Panthère i Tank, Rolex Lady-Datejust 28/31, Patek Philippe Twenty~4, Chopard Happy Sport, Bvlgari Serpenti, Piaget Limelight. Z gwarancją autentyczności butiku i 12 m-cy gwarancji. Mokotowska 71.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: localizedAlternates(`/${SLUG}`, 'pl'),
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, siteName: 'Warszawski Czas', locale: 'pl_PL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  const products = ladiesWatches(6)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki damskie luksusowe w Warszawie', serviceType: 'Sprzedaż zegarków damskich', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki damskie luksusowe Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki damskie luksusowe — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Damskie · Biżuteryjne · Unisex"
        h1="Damskie zegarki luksusowe w Warszawie"
        intro="Cartier Panthère i Tank, Rolex Lady-Datejust 28 i 31, Patek Philippe Twenty~4, Chopard Happy Sport z ruchomymi diamentami, Bvlgari Serpenti i Bvlgari Bvlgari Bvlgari, Piaget Limelight, Audemars Piguet Royal Oak 33/37 mm dla niej. Wybór damskich zegarków luksusowych z certyfikatem autentyczności i 12 miesiącami gwarancji butiku."
        primaryCtaLabel="Zobacz damskie zegarki"
        source="landing-zegarki-damskie"
        body={[
          {
            heading: 'Kultowe damskie zegarki — Cartier, Rolex, Patek Philippe',
            paragraphs: [
              'Damski zegarek luksusowy łączy precyzję mechanizmu z biżuteryjną estetyką — koperta jest mniejsza (zwykle 22–34 mm), a wykończenie często obejmuje 18K złoto żółte, różowe lub białe, masę perłową na tarczy oraz indeksy lub bezele diamentowe. W ostatnich latach zatarciu uległa też granica między „męskim” a „damskim” — Cartier Tank, Rolex Datejust 36 i Audemars Piguet Royal Oak 37 są dziś chętnie noszone przez kobiety jako alternatywa dla biżuteryjnych modeli klasycznych.',
              'W Warszawie oferujemy najszerszy wybór damskich zegarków luksusowych w trzech segmentach: biżuteryjne (Cartier Panthère, Bvlgari Serpenti, Piaget Limelight), klasyczne sportowe-elegant (Rolex Lady-Datejust, Patek Philippe Twenty~4, Chopard Happy Sport) oraz unisex z mniejszą kopertą (Cartier Tank Small/Medium, Audemars Piguet Royal Oak 37 mm, Vacheron Constantin Overseas 37 mm).',
            ],
          },
          {
            heading: 'Co zwracają uwagę kobiety przy wyborze zegarka',
            paragraphs: [
              'Pierwsza decyzja to rozmiar koperty — typowy damski zegarek to dziś 26–32 mm, choć rośnie segment 33–37 mm dla klientek ceniących mocniejszy charakter. Druga to materiał — pełne 18K złoto żółte, różowe i białe (Cartier Panthère, Patek Twenty~4) lub bicolor i stal z elementami złota (Rolex Lady-Datejust Rolesor). Trzecia — diamenty (bezel, indeksy, koperta).',
              'Czwarty czynnik to typ bransolety — Cartier oferuje system QuickSwitch (szybka wymiana w domu), Rolex Jubilee i Oyster, Patek Philippe Twenty~4 — zintegrowaną bransoletę o pięciokątnych ogniwach, Bvlgari Serpenti — charakterystyczne podwójne lub trzykrotne owijanie wokół nadgarstka. Ostatnia decyzja — mechanizm: kwarcowy (cieńszy, bezobsługowy, lekki — Tank Must, Twenty~4 5300) lub automatyczny (Lady-Datejust, Cartier Tank Solo Automatique, Patek Twenty~4 Automatic 7300).',
            ],
          },
        ]}
        highlights={[
          { title: 'Cartier Panthère, Tank, Baignoire', description: 'Kultowa biżuteryjna szkoła Cartiera — Panthère Small/Medium, Tank Must i Tank Française Small, Baignoire Mini i Allongée.' },
          { title: 'Rolex Lady-Datejust 28 i 31', description: 'Lady-Datejust Rolesor, pełne 18K, tarcze MOP i diamentowe, bezele diamentowe, bransolety Jubilee i President.' },
          { title: 'Patek Twenty~4 i Chopard Happy Sport', description: 'Patek Twenty~4 Automatic 7300/1200A, Chopard Happy Sport z 7 ruchomymi diamentami.' },
        ]}
        bulletsHeading="Damskie modele najczęściej w ofercie"
        bullets={[
          'Cartier Panthère Small (22 mm), Medium (27 mm), Large (37 mm) — stal, 18K, diamentowy bezel',
          'Cartier Tank Must, Tank Française Small i Medium, Tank Louis Cartier Small',
          'Cartier Baignoire Mini i Allongée, Cartier Mini Baignoire — 18K złoto, biżuteryjna stylistyka',
          'Rolex Lady-Datejust 28 (279xxx) i 31 (278xxx), Rolesor żółty/Everose, MOP, diamenty',
          'Patek Philippe Twenty~4 Automatic 7300/1200A i Twenty~4 Quartz 4910/1200',
          'Chopard Happy Sport 30/36 mm z 7 ruchomymi diamentami, L.U.C XPS',
          'Bvlgari Serpenti, Bvlgari Bvlgari Bvlgari, Diva’s Dream',
          'Piaget Limelight, Possession, Polo S Ladies',
          'Audemars Piguet Royal Oak Selfwinding 33/37 mm',
        ]}
        productPreview={{
          heading: 'Zegarki damskie z aktualnej oferty',
          description: 'Wybór modeli damskich i unisex w mniejszych rozmiarach koperty.',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        faq={[
          { q: 'Jaki rozmiar koperty wybrać dla kobiety?', a: 'Klasyczny damski zegarek to 26–31 mm. Klientki ceniące mocniejszy, unisex charakter wybierają 33–37 mm (Cartier Tank Medium, Rolex Datejust 36, AP Royal Oak 37). Dla bardzo subtelnych nadgarstków najlepiej sprawdza się 22–25 mm (Cartier Mini Baignoire, Panthère Small).' },
          { q: 'Czy zegarek damski musi mieć diamenty?', a: 'Nie. Wiele najpiękniejszych damskich zegarków nie ma diamentów (Cartier Tank Must w jednolitej tarczy, Rolex Lady-Datejust z gładkim bezelem, Patek Twenty~4 7300 z rzymskimi cyframi). Diamenty dodają biżuteryjnego charakteru i wartości, ale nie są wymogiem.' },
          { q: 'Co jest lepsze — kwarc czy automat?', a: 'Kwarc: cieńszy, bezobsługowy, lekki, idealny do drobnego nadgarstka i okazjonalnego noszenia. Automat: bardziej tradycyjny, wymaga ruchu nadgarstka lub winderem, lepszy do codziennego noszenia. Wybór zależy od stylu życia klientki.' },
          { q: 'Czy oferujecie skup damskich zegarków?', a: 'Tak — skupujemy używane Cartier Panthère, Tank, Baignoire, Rolex Lady-Datejust, Patek Twenty~4, Chopard, Bvlgari i inne marki. Wstępna wycena po zdjęciach w 15 minut.' },
        ]}
        closingHeading="Wybierz damski zegarek"
        relatedLinks={[
          { href: '/zegarki-z-diamentami-warszawa', label: 'Zegarki z diamentami' },
          { href: '/zegarki-ze-zlota-warszawa', label: 'Zegarki ze złota' },
          { href: '/zegarki-cartier-warszawa', label: 'Zegarki Cartier' },
          { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe' },
        ]}
      />
    </>
  )
}
