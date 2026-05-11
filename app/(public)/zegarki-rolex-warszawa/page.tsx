import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { productsByBrand } from '@/lib/seo-product-filters'

const SLUG = 'zegarki-rolex-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Rolex Warszawa — używane zegarki Rolex, skup i modele na zamówienie | Warszawski Czas'
const DESCRIPTION =
  'Zegarki Rolex w Warszawie — Submariner, Daytona, Datejust, GMT-Master, Day-Date, Sky-Dweller, Yacht-Master. Modele dostępne od ręki, sprowadzanie konkretnych referencji bez listy oczekujących i skup Rolexów. Mokotowska 71.'

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
    images: [{ url: 'https://warszawskiczas.pl/Rolex Wimbledon.jpg', alt: 'Rolex Datejust Wimbledon — Warszawski Czas' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/Rolex Wimbledon.jpg'] },
}

export default function Page() {
  const products = productsByBrand('Rolex', 6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki Rolex w Warszawie', serviceType: 'Sprzedaż zegarków Rolex', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki Rolex Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki Rolex — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Rolex · Warszawa"
        h1="Zegarki Rolex w Warszawie — od ręki i na zamówienie"
        intro="Submariner, Daytona, Datejust, GMT-Master, Day-Date, Sky-Dweller, Yacht-Master, Explorer, Sea-Dweller, Air-King — najpełniejsza dostępność używanych zegarków Rolex w Warszawie. Sprowadzamy konkretne referencje Rolex bez listy oczekujących u autoryzowanego dealera. Działamy na rynku wtórnym i nie jesteśmy autoryzowanym dealerem Rolex SA."
        primaryCtaLabel="Zapytaj o model Rolex"
        source="landing-zegarki-rolex"
        heroImage={{ src: '/Rolex Wimbledon.jpg', alt: 'Rolex Datejust Wimbledon — butik Warszawski Czas, Mokotowska 71' }}
        body={[
          {
            heading: 'Rolex w Warszawie — dlaczego rynek wtórny',
            paragraphs: [
              'Od kilku lat Rolex w autoryzowanych salonach w Warszawie i Polsce jest praktycznie niedostępny od ręki — większość poszukiwanych referencji wymaga wieloletniej historii zakupów lub wpisu na listę oczekujących bez gwarancji terminu. Dla klienta, który chce mieć konkretny model Rolex w określonym czasie i z gwarancją autentyczności, rynek wtórny jest dziś naturalną drogą zakupu.',
              'Warszawski Czas specjalizuje się w obsłudze klientów szukających konkretnych zegarków Rolex w Warszawie. Nasza sieć dostawców obejmuje sprawdzonych dilerów w Polsce i Europie oraz prywatnych właścicieli — to pozwala nam zwykle w 7–30 dni przedstawić jeden lub dwa egzemplarze odpowiadające briefowi: marka, referencja, tarcza, rok, komplet papierów, budżet.',
              'Każdy Rolex, który trafia do butiku przy Mokotowskiej 71, przechodzi pełną weryfikację autentyczności i stanu — kontrolę mechanizmu, oznaczeń, pomiarów chronometrycznych i porównanie z bazą referencji. Klient otrzymuje zegarek z certyfikatem butiku oraz 12 miesięcami gwarancji butiku na pracę mechanizmu, niezależnie od pozostałej gwarancji Rolex.',
            ],
          },
          {
            heading: 'Najczęściej obsługiwane referencje Rolex',
            paragraphs: [
              'Rolex Submariner — w wersji Date i No Date, w stali 904L, ze złotem (Bluesy, Submariner Date 126613LB) oraz w pełnym żółtym lub białym złocie. Najczęściej kupowane referencje to 126610LN (czarna), 126610LV (Kermit), 126613LN i archiwalna 116610LV (Hulk).',
              'Rolex Daytona — kultowy chronograf w stali (116500LN i 126500LN), z białą lub czarną tarczą, w stalowo-żółtym Rolesor (116503), w pełnym żółtym i różowym złocie oraz w platynie (116506). Sprowadzamy także rzadkie konfiguracje, takie jak Daytona „Le Mans” 126529LN i edycje meteorytowe.',
              'Rolex GMT-Master II — Pepsi 126710BLRO, Batman 126710BLNR, Sprite 126720VTNR, Coke i Root Beer 126711CHNR. Dla klientów ceniących klasykę dostępne są także ostatnie generacje 116710LN i wersje w pełnym złocie.',
              'Rolex Datejust — najszersza linia produktowa: Datejust 36, Datejust 41, Lady-Datejust 28 i 31. Najpopularniejsze tarcze to Wimbledon, Tapestry, Mother of Pearl i diamentowe oraz wersje Rolesor (stal-złoto żółte i Everose).',
              'Rolex Day-Date — President w pełnym 18K złocie żółtym, białym, Everose oraz w platynie (228206). Tarcze Olive Roman, Meteorite i diamentowe są szczególnie poszukiwane w segmencie kolekcjonerskim.',
              'Rolex Sky-Dweller, Yacht-Master 40 i 42, Explorer I i II, Sea-Dweller 126600 oraz Air-King 126900 — sprowadzamy także te modele zarówno w wersjach stalowych, jak i z dodatkiem złota oraz z bransoletami Oysterflex i Oyster.',
            ],
          },
        ]}
        highlights={[
          { title: 'Bez listy oczekujących', description: 'Sprowadzamy poszukiwane referencje Rolex w 7–30 dni z naszej sieci sprawdzonych dostawców w Polsce i Europie.' },
          { title: 'Certyfikat autentyczności', description: 'Każdy egzemplarz po pełnej weryfikacji mechanizmu, oznaczeń koperty i numerów seryjnych — z dokumentacją butiku.' },
          { title: '12 miesięcy gwarancji', description: 'Gwarancja butiku Warszawski Czas na pracę mechanizmu, niezależnie od pozostałej gwarancji Rolex.' },
        ]}
        bulletsHeading="Modele Rolex najczęściej w obrocie"
        bullets={[
          'Rolex Submariner Date 126610LN, 126610LV (Kermit), 126613LB (Bluesy), Submariner No Date 124060',
          'Rolex Daytona 116500LN, 126500LN, 116503 (Rolesor), 116519LN, Daytona „Le Mans” 126529LN',
          'Rolex GMT-Master II Pepsi 126710BLRO, Batman 126710BLNR, Sprite 126720VTNR, Coke, Root Beer',
          'Rolex Datejust 36 i 41 — Wimbledon, Tapestry, MOP, Jubilee/Oyster, Rolesor żółty i Everose',
          'Rolex Day-Date 36 i 40 — Olive Roman, Meteorite, President w 18K, platyna 228206',
          'Rolex Sky-Dweller, Yacht-Master 40/42, Explorer I/II, Sea-Dweller 126600, Air-King 126900',
          'Rolex Lady-Datejust 28/31 z bezelem diamentowym, tarczą MOP i bransoletą Jubilee',
        ]}
        productPreview={{
          heading: 'Wybrane Rolexy z aktualnej oferty',
          description: 'Egzemplarze dostępne od ręki w butiku przy Mokotowskiej 71. Pełną listę zegarków znajdziesz w katalogu.',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        stepsHeading="Jak sprowadzimy Twojego Rolexa"
        steps={[
          { title: 'Brief', description: 'Mówisz nam, jaki model Rolex Cię interesuje (referencja, tarcza, rok, komplet papierów, budżet).' },
          { title: 'Poszukiwanie', description: 'Sprawdzamy stany w bazie, sieć dostawców w Polsce i Europie oraz rynek wtórny.' },
          { title: 'Oferta', description: 'Otrzymujesz 1–3 egzemplarze do wyboru ze zdjęciami, papierami i ceną finalną.' },
          { title: 'Finalizacja', description: 'Zakup w butiku albo zdalnie z ubezpieczonym kurierem — z certyfikatem i 12 m-cy gwarancji.' },
        ]}
        faq={[
          { q: 'Czy macie zegarki Rolex dostępne od ręki w butiku w Warszawie?', a: 'Tak. Część egzemplarzy znajduje się w stałej ekspozycji butiku przy Mokotowskiej 71 i można obejrzeć je tego samego dnia po krótkim umówieniu wizyty.' },
          { q: 'Czy jesteście autoryzowanym dealerem Rolex?', a: 'Nie. Warszawski Czas działa wyłącznie na rynku wtórnym i nie jest autoryzowanym dealerem Rolex SA. Sprowadzamy używane Rolexy od sprawdzonych dostawców i prywatnych właścicieli.' },
          { q: 'Ile trwa sprowadzenie konkretnej referencji Rolex?', a: 'Najczęściej 7–30 dni w zależności od dostępności modelu na rynku europejskim. Modele bardzo poszukiwane (Daytona stalowa, Submariner Hulk) mogą wymagać dłuższego czasu.' },
          { q: 'Czy każdy używany Rolex w Warszawskim Czasie ma papiery i pudełko?', a: 'Większość tak. Egzemplarze bez kart lub pudełka oznaczamy wyraźnie i wyceniamy odpowiednio niżej. W briefie możesz wskazać wymóg pełnego kompletu — sprowadzimy tylko zegarki, które go spełniają.' },
          { q: 'Czy oferujecie skup Rolexów w Warszawie?', a: 'Tak — prowadzimy też skup Rolex Warszawa. Wstępna wycena każdej referencji w 15 minut po zdjęciach, finalizacja tego samego dnia gotówką lub przelewem.' },
        ]}
        closingHeading="Zapytaj o swój model Rolex"
        closingText="Submariner, Daytona, Datejust, GMT-Master, Day-Date, Sky-Dweller — sprowadzimy konkretną referencję Rolex w 7–30 dni."
        relatedLinks={[
          { href: '/rolex-na-zamowienie', label: 'Rolex na zamówienie' },
          { href: '/skup-rolex-warszawa', label: 'Skup Rolex Warszawa' },
          { href: '/serwis-rolex-warszawa', label: 'Serwis Rolex' },
          { href: '/komis-rolex-warszawa', label: 'Komis Rolex' },
          { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe Warszawa' },
        ]}
      />
    </>
  )
}
