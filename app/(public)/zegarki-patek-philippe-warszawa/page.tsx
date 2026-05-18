import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { productsByBrand } from '@/lib/seo-product-filters'
import { getAllProducts } from '@/from-cms/adapters/products'
import { relatedLinksFor } from '@/lib/related-links'

const SLUG = 'zegarki-patek-philippe-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Patek Philippe Warszawa — używane zegarki Patek, Nautilus, Calatrava, Aquanaut'
const DESCRIPTION =
  'Patek Philippe w Warszawie — Nautilus, Aquanaut, Calatrava, Annual Calendar, Twenty~4. Sprzedaż, sprowadzanie konkretnych referencji oraz skup. Każdy egzemplarz zweryfikowany pod kątem autentyczności. Mokotowska 71.'

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
    images: [{ url: 'https://warszawskiczas.pl/patek.jpg', alt: 'Patek Philippe — Warszawski Czas, Mokotowska 71' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/patek.jpg'] },
}

export default async function Page() {
  const all = await getAllProducts()
  const products = productsByBrand(all, 'Patek Philippe', 6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki Patek Philippe w Warszawie', serviceType: 'Sprzedaż zegarków Patek Philippe', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki Patek Philippe Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki Patek Philippe — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Patek Philippe · Warszawa"
        h1="Zegarki Patek Philippe w Warszawie — Nautilus, Calatrava, Aquanaut"
        intro="Patek Philippe Nautilus 5711, 5712, 5811, Aquanaut 5167 i 5168, Calatrava 6119, Annual Calendar 5396, Twenty~4 Automatic, Grand Complications 5270, World Time 5230 — szeroki wybór używanych zegarków Patek Philippe w Warszawie. Sprowadzamy konkretne referencje na zamówienie oraz prowadzimy skup egzemplarzy Patek Philippe."
        primaryCtaLabel="Zapytaj o model Patek"
        source="landing-zegarki-patek-philippe"
        heroImage={{ src: '/patek.jpg', alt: 'Patek Philippe — butik Warszawski Czas, Mokotowska 71' }}
        body={[
          {
            heading: 'Patek Philippe w Warszawie — rynek wtórny zamiast wieloletniej listy oczekujących',
            paragraphs: [
              'Patek Philippe jest dziś jedną z trudno dostępnych marek zegarmistrzowskich na rynku autoryzowanym. Sportowe Nautilus 5711 i Aquanaut 5167 były od lat formalnie niemożliwe do kupienia w salonie bez wieloletniej historii zakupów; Calatrava i Grand Complications wciąż wymagają solidnej relacji z dilerem. Dla klienta szukającego konkretnego Patek Philippe w Warszawie rynek wtórny jest dziś naturalną — i często jedyną — drogą do egzemplarza.',
              'Warszawski Czas specjalizuje się w wyszukiwaniu i weryfikacji używanych zegarków Patek Philippe dla wymagających klientów z Polski i Europy Środkowej. Nasza sieć dostawców łączy sprawdzonych dilerów w Genewie, Mediolanie, Paryżu, Frankfurcie i Londynie, kolekcjonerów prywatnych oraz aukcje branżowe. To pozwala typowo w 14–60 dni przedstawić jeden lub dwa egzemplarze odpowiadające briefowi: referencja, tarcza, materiał, rok, komplet papierów, budżet.',
              'Każdy Patek Philippe, który trafia do butiku przy Mokotowskiej 71, przechodzi wieloetapową weryfikację autentyczności i stanu — analizę mechanizmu (kalibry 240, 324, 26-330, 28-520, CH 28-520), kontrolę numerów seryjnych, oznaczeń koperty, papierów oraz historii serwisowej. Dla wątpliwych egzemplarzy możliwa jest dodatkowa weryfikacja w oficjalnym serwisie marki, w tym procedura Extract from the Archives w Genewie. Klient otrzymuje zegarek z pełnym opisem stanu, dokumentacji i przebiegu weryfikacji.',
            ],
          },
          {
            heading: 'Najczęściej obsługiwane referencje Patek Philippe',
            paragraphs: [
              'Patek Philippe Nautilus — kultowy sportowy klasyk Gérald Genta z 1976 roku. Najposzukiwańsze referencje to 5711/1A (stalowa z niebieską lub szarą tarczą), 5712/1A z fazą księżyca i mocą rezerwy, 5811/1G w białym złocie (następca 5711) oraz 5990/1A Travel Time Chronograph. Sprowadzamy także damski Nautilus 7118 i wersje z diamentami.',
              'Patek Philippe Aquanaut — sportowy zegarek wprowadzony w 1997 roku, dzisiaj często szybciej dostępny niż Nautilus. Klasyczne referencje to Aquanaut 5167A z czarną/niebieską tarczą, Aquanaut 5168G "Khaki" 42 mm w białym złocie, Aquanaut Travel Time 5164 oraz Aquanaut Chronograph 5968A. Damska linia Aquanaut Luce 5267 cieszy się stałą popularnością.',
              'Patek Philippe Calatrava — esencja klasycznego Patek Philippe. Najczęściej spotykane to Calatrava 6119G i 6119R (40 mm), Calatrava 5227G/R z hunter case-back, Calatrava 5196G/R i klasyczna 5227. Dla kolekcjonerów sprowadzamy także rzadkie Calatrava 6007A i archiwalne Calatrava 96.',
              'Patek Philippe Annual Calendar i Perpetual Calendar — komplikacje, które definiują markę. Annual Calendar 5396G/R, 5205G/R z fazą księżyca, Perpetual Calendar 5320G i 5327G, oraz najbardziej kolekcjonerskie Grand Complications 5270, 5271 i Sky Moon Tourbillon 6002.',
              'Patek Philippe Twenty~4 — damska linia, w wersjach kwarcowych (4910) i automatycznych (7300). Wersje z diamentowym bezelem i tarczą mother-of-pearl pozostają stałym wyborem dla klientek wybierających pierwszą poważną komplikację.',
              'Patek Philippe World Time 5230, Aquanaut Luce 5267, Chronograph 5170, Nautilus 5980 — sprowadzamy także te modele zarówno w wersjach stalowych, jak i w 18K złocie żółtym, różowym, białym i w platynie.',
            ],
          },
          {
            heading: 'Autentyczność, dokumenty i opis stanu',
            paragraphs: [
              'Patek Philippe to marka, w której papiery, kompletność i historia serwisowa istotnie wpływają na wartość rynkową. Każdy używany Patek Philippe w naszym butiku jest opisany pod kątem stanu zegarka i kompletności (papiery, pudełko, dodatkowe ogniwa bransolety, certyfikaty serwisowe). Egzemplarze bez kart oznaczamy wyraźnie i wyceniamy odpowiednio niżej.',
              'Klient otrzymuje pełen opis egzemplarza obejmujący przebieg weryfikacji autentyczności, stan koperty, mechanizmu, tarczy i bransolety, oraz historię serwisową, jeśli jest znana. Po sprzedaży wspieramy klientów posprzedażowo — pytania techniczne, ewentualne regulacje, wycena pod ubezpieczenie, doradztwo przy serwisie.',
            ],
          },
        ]}
        highlights={[
          { title: 'Sprowadzanie konkretnej referencji', description: 'Nautilus 5711, Aquanaut 5167, Calatrava 6119 i inne — typowo 14–60 dni z sieci sprawdzonych dostawców w Europie.' },
          { title: 'Pełna weryfikacja autentyczności', description: 'Mechanizm, oznaczenia, papiery, historia serwisowa — z możliwością Extract from the Archives w Genewie przy szczególnie wartościowych egzemplarzach.' },
          { title: 'Pełen opis i wsparcie posprzedażowe', description: 'Każdy egzemplarz z pełną dokumentacją stanu, historią serwisową (jeśli znana) i bezterminowym wsparciem technicznym po zakupie.' },
        ]}
        bulletsHeading="Patek Philippe — referencje najczęściej w obrocie"
        bullets={[
          'Patek Philippe Nautilus 5711/1A, 5711/1R, 5712/1A, 5811/1G, 5990/1A Travel Time Chronograph, Nautilus 7118 (damski)',
          'Patek Philippe Aquanaut 5167A, 5167R, 5168G (42 mm Khaki), 5164 Travel Time, 5968A Chronograph, Aquanaut Luce 5267',
          'Patek Philippe Calatrava 6119G, 6119R, 5227G, 5227R, 5196G/R, 6007A, klasyczna Calatrava 96',
          'Patek Philippe Annual Calendar 5396G/R, 5205G/R Moon Phase, Twenty~4 Automatic 7300/1200A z diamentowym bezelem',
          'Patek Philippe Perpetual Calendar 5320G, 5327G, Grand Complications 5270, 5271, World Time 5230G/R',
          'Patek Philippe Chronograph 5170G, 5172G, Split-Seconds Chronograph 5370P, Sky Moon Tourbillon 6002',
          'Patek Philippe Gondolo 5124, Golden Ellipse 5738/1R, Twenty~4 Manual 4910, Twenty~4 Automatic 7300',
        ]}
        productPreview={{
          heading: 'Wybrane Patek Philippe z aktualnej oferty',
          description: 'Egzemplarze dostępne od ręki w butiku przy Mokotowskiej 71. Pełną listę zegarków znajdziesz w katalogu.',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        stepsHeading="Jak sprowadzimy Twojego Patek Philippe"
        steps={[
          { title: 'Brief', description: 'Podajesz model Patek Philippe (referencja, tarcza, materiał, rok, komplet papierów, budżet).' },
          { title: 'Wyszukiwanie', description: 'Sprawdzamy stany w bazie, sieć dostawców w Genewie, Mediolanie, Frankfurcie, Londynie oraz rynek prywatny.' },
          { title: 'Oferta', description: 'Otrzymujesz 1–3 egzemplarze do wyboru ze zdjęciami, dokumentacją i ceną finalną.' },
          { title: 'Finalizacja', description: 'Zakup w butiku albo zdalnie z ubezpieczonym kurierem, z pełną dokumentacją egzemplarza i wsparciem posprzedażowym.' },
        ]}
        faq={[
          { q: 'Czy są jakieś Patek Philippe dostępne od ręki w butiku?', a: 'Tak, część egzemplarzy znajduje się w stałej ekspozycji butiku przy Mokotowskiej 71. Listę aktualnych dostępnych Patek Philippe znajdziesz w katalogu, a egzemplarze można obejrzeć tego samego dnia po krótkim umówieniu wizyty.' },
          { q: 'Czy jesteście autoryzowanym dealerem Patek Philippe?', a: 'Nie. Warszawski Czas działa wyłącznie na rynku wtórnym i nie jest autoryzowanym dilerem Patek Philippe SA. Sprowadzamy używane zegarki Patek Philippe od sprawdzonych dostawców europejskich i prywatnych właścicieli.' },
          { q: 'Ile trwa sprowadzenie konkretnej referencji Patek Philippe?', a: 'Typowo 14–60 dni w zależności od dostępności modelu na rynku europejskim. Nautilus 5711, Aquanaut 5167 w niektórych konfiguracjach i rzadkie Grand Complications mogą wymagać dłuższego czasu — do 90 dni dla najbardziej poszukiwanych egzemplarzy.' },
          { q: 'Czy każdy używany Patek Philippe ma papiery i pudełko?', a: 'Większość tak. Egzemplarze bez kart, dokumentów lub pudełka są wyraźnie oznaczane i wyceniane odpowiednio niżej. W briefie możesz wskazać wymóg pełnego kompletu — sprowadzimy tylko zegarki, które ten warunek spełniają.' },
          { q: 'Czy oferujecie skup zegarków Patek Philippe w Warszawie?', a: 'Tak. Prowadzimy skup zegarków Patek Philippe — wstępna wycena każdej referencji w 15 minut po zdjęciach, finalizacja tego samego dnia gotówką lub przelewem po obejrzeniu egzemplarza w butiku.' },
          { q: 'Czy mogę przyjść do butiku obejrzeć kilka modeli Patek Philippe?', a: 'Tak, prosimy o wcześniejsze umówienie wizyty telefonicznie albo przez formularz. Przygotujemy egzemplarze odpowiadające Twojemu briefowi i zarezerwujemy czas dyskretnej, prywatnej konsultacji.' },
        ]}
        closingHeading="Zapytaj o swój model Patek Philippe"
        closingText="Nautilus, Aquanaut, Calatrava, Twenty~4 — sprowadzimy konkretną referencję Patek Philippe w 14–60 dni."
        relatedLinks={relatedLinksFor('zegarki-patek-philippe-warszawa', 'brand-hub')}
      />
    </>
  )
}
