import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { productsByBrand } from '@/lib/seo-product-filters'
import { getAllProducts } from '@/from-cms/adapters/products'
import { relatedLinksFor } from '@/lib/related-links'

const SLUG = 'zegarki-audemars-piguet-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Audemars Piguet Warszawa — używane zegarki AP Royal Oak, Royal Oak Offshore, Code 11.59'
const DESCRIPTION =
  'Audemars Piguet w Warszawie — Royal Oak 15500, 15510, 15400, Royal Oak Offshore, Royal Oak Concept, Code 11.59. Sprzedaż, sprowadzanie konkretnych referencji AP oraz skup. Pełna weryfikacja autentyczności. Mokotowska 71.'

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
    images: [{ url: 'https://warszawskiczas.pl/opengraph-image.jpg', alt: 'Audemars Piguet — Warszawski Czas, Mokotowska 71' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/opengraph-image.jpg'] },
}

export default async function Page() {
  const all = await getAllProducts()
  const products = productsByBrand(all, 'Audemars Piguet', 6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki Audemars Piguet w Warszawie', serviceType: 'Sprzedaż zegarków Audemars Piguet', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki Audemars Piguet Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki Audemars Piguet — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Audemars Piguet · Warszawa"
        h1="Zegarki Audemars Piguet w Warszawie — Royal Oak, Offshore, Code 11.59"
        intro="Audemars Piguet Royal Oak 15500, 15510, 15400, 15202 Jumbo, Royal Oak Offshore 26238, 15710, Royal Oak Concept, Royal Oak Chronograph 26240, oraz Code 11.59 — szeroki wybór używanych zegarków Audemars Piguet w Warszawie. Sprowadzamy konkretne referencje AP na zamówienie oraz prowadzimy skup zegarków Audemars Piguet."
        primaryCtaLabel="Zapytaj o model AP"
        source="landing-zegarki-audemars-piguet"
        body={[
          {
            heading: 'Audemars Piguet w Warszawie — rynek wtórny przy Royal Oaku praktycznie nie ma alternatywy',
            paragraphs: [
              'Audemars Piguet od kilku lat radykalnie ograniczył dostępność Royal Oaka w autoryzowanych salonach. Stalowy Royal Oak 15500ST i Royal Oak Jumbo 16202ST są praktycznie niedostępne od ręki w salonach AP w Warszawie i Europie, a Royal Oak Offshore i Royal Oak Concept wymagają wieloletniej historii zakupów u dilera. Dla klienta, który chce mieć konkretny model Audemars Piguet w określonym czasie, rynek wtórny jest dziś naturalną drogą zakupu.',
              'Warszawski Czas specjalizuje się w wyszukiwaniu i weryfikacji używanych zegarków Audemars Piguet. Nasza sieć obejmuje sprawdzonych dilerów w Genewie, Lugano, Mediolanie, Monako, Frankfurcie i Londynie oraz prywatnych właścicieli z rynku Europy Środkowej. Typowo w 14–60 dni przedstawiamy jeden lub dwa egzemplarze odpowiadające briefowi: referencja, tarcza (Grande Tapisserie, "Petite Tapisserie", smoked, blue Grande Tapisserie, biała, czarna), materiał, rok, komplet papierów, budżet.',
              'Każdy Audemars Piguet, który trafia do butiku przy Mokotowskiej 71, przechodzi pełną weryfikację autentyczności i stanu — kontrolę mechanizmów (kalibry 3120, 4302, 4401, 2385), oznaczeń koperty, próby złota (w wersjach 18K), dokumentów i historii serwisowej. Klient otrzymuje zegarek z pełnym opisem stanu, dokumentacji i przebiegu weryfikacji oraz wsparciem posprzedażowym.',
            ],
          },
          {
            heading: 'Najczęściej obsługiwane referencje Audemars Piguet',
            paragraphs: [
              'Audemars Piguet Royal Oak 15500ST — następca legendarnej 15400ST, w stalowej kopercie 41 mm z tarczą Grande Tapisserie. Najczęściej spotykane wersje to niebieska, czarna, srebrna, zielona oraz brązowa "Smoked". Sprowadzamy także Royal Oak 15510ST (41 mm, następca 15500 z subtelnymi zmianami) i Royal Oak 15400ST (archiwalna).',
              'Audemars Piguet Royal Oak Jumbo 16202ST — 50th Anniversary edition (2022) jako kontynuacja kultowej "Jumbo" 15202ST z 1972 roku. Koperta 39 mm, ekstra-cienka, oryginalna tarcza Petite Tapisserie. Następca 15202ST i bezpośredni nawiązanie do pierwszego Royal Oaka A-Series.',
              'Audemars Piguet Royal Oak Chronograph 26240ST — chronograf 41 mm w stali z kalibrem 4401 (po 2021). Dostępne w wariancie niebieskim, czarnym, srebrnym i "Panda" (biała tarcza z czarnymi licznikami). Archiwalne 26331ST i 26331OR również w obrocie.',
              'Audemars Piguet Royal Oak Offshore — sportowa, większa wersja Royal Oaka. Najczęściej spotykane to Royal Oak Offshore Chronograph 26238ST (43 mm, kalibr 4404), Royal Oak Offshore Diver 15710ST i edycje limitowane: Survivor, End of Days, Safari.',
              'Audemars Piguet Royal Oak Concept — najbardziej eksperymentalna linia AP. Royal Oak Concept Flying Tourbillon, Royal Oak Concept Black Panther, oraz Royal Oak Concept Carbon. To zegarki dla kolekcjonerów ceniących haute horlogerie i radykalny design.',
              'Audemars Piguet Code 11.59 — okrągła linia haute joaillerie wprowadzona w 2019 roku. Code 11.59 Selfwinding 15210, Chronograph 26393, Perpetual Calendar 26394 oraz Tourbillon Openworked. Ciekawa alternatywa dla klientów szukających klasycznej okrągłej koperty AP.',
            ],
          },
          {
            heading: 'Materiał, tarcza Tapisserie i wartość rynkowa',
            paragraphs: [
              'Royal Oak występuje w stali Oystersteel, 18K złocie żółtym (15500BA, 15510BA), 18K złocie różowym (15500OR, 15510OR, 15400OR), 18K złocie białym oraz w platynie. Wersje stalowe są na rynku wtórnym typowo trudno dostępne i potrafią zyskiwać na wartości — choć dynamika rynku Royal Oaka ST w latach 2023–2025 była zmienna.',
              'Tarcza Royal Oaka — Grande Tapisserie, Petite Tapisserie, Mega Tapisserie (Offshore) — to charakterystyczny wzór wytwarzany dziedzinową techniką pantografu w manufakturze AP. Dla wartości rynkowej istotne są też kolory: niebieska Grande Tapisserie (15500ST.OO.1220ST.03) jest klasykiem, zielona (2022) szybko zyskała kultowy status, "Smoked Brown" stała się statusowa wśród kolekcjonerów.',
            ],
          },
        ]}
        highlights={[
          { title: 'Sprowadzanie konkretnej referencji AP', description: 'Royal Oak 15500, 15510, Jumbo 16202, Offshore 26238 i inne — typowo 14–60 dni z sieci europejskich dostawców.' },
          { title: 'Pełna weryfikacja autentyczności', description: 'Mechanizm AP 3120/4302/4401, oznaczenia koperty, dokumenty, historia serwisowa — z możliwością kierowania do oficjalnego serwisu marki przy wartościowych egzemplarzach.' },
          { title: 'Pełne wsparcie posprzedażowe', description: 'Bezterminowe wsparcie techniczne po zakupie — pytania techniczne, regulacje, wycena pod ubezpieczenie, doradztwo przy serwisie.' },
        ]}
        bulletsHeading="Audemars Piguet — referencje najczęściej w obrocie"
        bullets={[
          'Royal Oak 15500ST — niebieska, czarna, srebrna, zielona, "Smoked Brown" — stal Oystersteel 41 mm',
          'Royal Oak 15510ST — następca 15500 z subtelnymi zmianami estetycznymi (kalibr 7121)',
          'Royal Oak Jumbo 16202ST — 50th Anniversary 39 mm, Petite Tapisserie, ekstra-cienka koperta',
          'Royal Oak Chronograph 26240ST — 41 mm z kalibrem AP 4401 (panda, niebieska, czarna, srebrna)',
          'Royal Oak Offshore Chronograph 26238ST i 26420 — 42–43 mm, kalibr 4404 in-house',
          'Royal Oak Offshore Diver 15710ST — 42 mm, czarna, niebieska, zielona, pomarańczowa Méga',
          'Royal Oak 15500OR i 15510OR — 18K złoto różowe, 18K złoto żółte (15500BA)',
          'Royal Oak Concept Flying Tourbillon, Black Panther, Carbon — kolekcjonerskie',
          'Code 11.59 Selfwinding 15210, Chronograph 26393, Perpetual Calendar 26394',
          'Royal Oak Perpetual Calendar 26574 i Quantième Perpétuel "Skeleton" 26585',
        ]}
        productPreview={{
          heading: 'Wybrane Audemars Piguet z aktualnej oferty',
          description: 'Egzemplarze dostępne od ręki w butiku przy Mokotowskiej 71. Pełną listę zegarków znajdziesz w katalogu.',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        stepsHeading="Jak sprowadzimy Twojego AP"
        steps={[
          { title: 'Brief', description: 'Podajesz model Audemars Piguet (referencja, tarcza, materiał, rok, komplet papierów, budżet).' },
          { title: 'Wyszukiwanie', description: 'Sieć dostawców w Genewie, Lugano, Mediolanie, Monako, Frankfurcie i Londynie oraz rynek prywatny.' },
          { title: 'Oferta', description: 'Otrzymujesz 1–3 egzemplarze do wyboru ze zdjęciami, dokumentacją i ceną finalną.' },
          { title: 'Finalizacja', description: 'Zakup w butiku albo zdalnie z ubezpieczonym kurierem, z pełną dokumentacją egzemplarza i wsparciem posprzedażowym.' },
        ]}
        faq={[
          { q: 'Czy są jakieś Audemars Piguet dostępne od ręki w butiku?', a: 'Tak, część egzemplarzy znajduje się w stałej ekspozycji butiku przy Mokotowskiej 71. Aktualną listę dostępnych Royal Oaków i innych AP znajdziesz w katalogu — można je obejrzeć tego samego dnia po krótkim umówieniu wizyty.' },
          { q: 'Czy jesteście autoryzowanym dealerem Audemars Piguet?', a: 'Nie. Warszawski Czas działa wyłącznie na rynku wtórnym i nie jest autoryzowanym dilerem Audemars Piguet. Sprowadzamy używane zegarki AP od sprawdzonych dostawców europejskich i prywatnych właścicieli.' },
          { q: 'Ile trwa sprowadzenie konkretnej referencji Royal Oak?', a: 'Typowo 14–60 dni. Royal Oak 15500ST w klasycznych kolorach (niebieska, czarna) bywa dostępny w 14–30 dni; rzadsze konfiguracje (zielona, "Smoked Brown", Jumbo 16202) mogą wymagać 30–90 dni.' },
          { q: 'Czym różni się Royal Oak 15500 od 15510?', a: 'Royal Oak 15510 (od 2022) to ewolucja 15500 z drobnymi zmianami estetycznymi: nieco inny krój oznaczeń tarczy, zmieniony rotor z masywniejszą grawerą "Audemars Piguet" oraz nowsza wersja kalibru (4302 → 7121 w wybranych wariantach). Wymiary koperty 41 mm i estetyka zegarka pozostają praktycznie identyczne.' },
          { q: 'Czy oferujecie skup zegarków AP w Warszawie?', a: 'Tak. Prowadzimy skup zegarków Audemars Piguet — wstępna wycena każdej referencji w 15 minut po zdjęciach, finalizacja tego samego dnia gotówką lub przelewem po obejrzeniu egzemplarza w butiku.' },
          { q: 'Czy Royal Oak to dobra inwestycja?', a: 'Royal Oak ST przez lata 2018–2022 systematycznie zyskiwał na wartości; rynek wtórny w latach 2023–2025 wykazał korektę. Royal Oak Jumbo 16202ST 50th Anniversary, edycje limitowane i wersje w 18K złocie różowym pozostają w pozytywnym trendzie wartości w 5–10 letnim horyzoncie.' },
        ]}
        closingHeading="Zapytaj o swój model Audemars Piguet"
        closingText="Royal Oak, Offshore, Jumbo, Code 11.59 — sprowadzimy konkretną referencję AP w 14–60 dni."
        relatedLinks={relatedLinksFor('zegarki-audemars-piguet-warszawa', 'brand-hub')}
      />
    </>
  )
}
