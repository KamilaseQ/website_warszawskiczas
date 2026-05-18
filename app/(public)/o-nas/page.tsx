import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'o-nas'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'O nas — butik zegarków premium Warszawski Czas, Mokotowska 71'
const DESCRIPTION =
  'O butiku Warszawski Czas — niezależny butik zegarków luksusowych w sercu Warszawy od 2019 roku. Sprzedaż, sprowadzanie, skup, komis oraz serwis. Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling i inne renomowane marki. Mokotowska 71.'

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
    images: [{ url: 'https://warszawskiczas.pl/opengraph-image.jpg', alt: 'Warszawski Czas — butik zegarków premium, Mokotowska 71' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/opengraph-image.jpg'] },
}

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: URL,
  name: TITLE,
  description: DESCRIPTION,
  mainEntity: { '@id': 'https://warszawskiczas.pl/#organization' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'O nas')) }} />

      <SeoLanding
        eyebrow="O butiku · Mokotowska 71"
        h1="Warszawski Czas — butik zegarków premium w sercu Warszawy"
        intro="Warszawski Czas to butik zegarków luksusowych działający w Warszawie od 2019 roku. Specjalizujemy się w sprzedaży, sprowadzaniu, skupie i komisie zegarków premium — Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling i innych renomowanych marek. Działamy w lokalu przy ulicy Mokotowskiej 71 w Śródmieściu Warszawy. Naszą pracę definiują indywidualne podejście do każdego klienta, uczciwa i rzetelna obsługa oraz fachowe doradztwo oparte na długoletnim doświadczeniu."
        primaryCtaLabel="Umów wizytę w butiku"
        source="landing-o-nas"
        body={[
          {
            heading: 'Niezależny butik zegarków luksusowych w Warszawie',
            paragraphs: [
              'Warszawski Czas jest niezależnym butikiem zegarków premium. Nie jesteśmy autoryzowanym dilerem żadnej marki — działamy na rynku wtórnym i dobieramy egzemplarze samodzielnie. Dla klienta oznacza to dwie istotne rzeczy: po pierwsze, nie obowiązują nas listy oczekujących u autoryzowanych dealerów (Rolex, Patek Philippe, Audemars Piguet są dziś w salonach autoryzowanych w Warszawie praktycznie nieosiągalne od ręki); po drugie, mamy pełną swobodę wyboru egzemplarzy z całej Europy.',
              'Nasza oferta obejmuje zarówno modele kolekcjonerskie i inwestycyjne, jak i zegarki klasy podstawowej — z myślą o klientach zaczynających przygodę z mechanicznymi zegarkami luksusowymi. W ofercie znajdziesz męskie i damskie zegarki premium, biżuterię oraz dostęp do tzw. ukrytej kolekcji — egzemplarzy dostępnych tylko po krótkiej, prywatnej konsultacji.',
              'Klienci wracają do nas latami, bo wiedzą, że za każdym zegarkiem stoi rzeczywista, prywatna obsługa w fizycznym lokalu, weryfikacja autentyczności przed sprzedażą oraz wsparcie po zakupie — w tym serwis i konserwacja mechanizmu.',
            ],
          },
          {
            heading: 'Lokalizacja — Mokotowska 71, Śródmieście Warszawy',
            paragraphs: [
              'Butik Warszawski Czas znajduje się przy ulicy Mokotowskiej 71 w Śródmieściu — na jednej z najbardziej rozpoznawalnych ulic luksusowej Warszawy, w sąsiedztwie ulic Pięknej, Wilczej i placu Trzech Krzyży. Najbliższa stacja metra: Politechnika (linia M1), kilka minut spacerem. Parking — strefa płatnego parkowania na Mokotowskiej oraz parkingi podziemne w okolicy placu Trzech Krzyży.',
              'Pracujemy w modelu butikowym z osobnym pomieszczeniem konsultacyjnym. Wizyty rekomendujemy umawiać wcześniej — pozwala to nam przygotować egzemplarze odpowiadające Twojemu briefowi i zarezerwować czas wyłącznie dla jednej rozmowy. Konsultacje trwają zwykle 30–90 minut. Możliwe są również wizyty poza standardowymi godzinami otwarcia po wcześniejszym umówieniu.',
              'Kontakt: telefon +48 604 501 000, e-mail biuro@warszawskiczas.pl. Jesteśmy obecni na Facebooku, Instagramie i TikToku — tam publikujemy nowe egzemplarze trafiające do butiku oraz krótkie materiały edukacyjne o markach i modelach.',
            ],
          },
          {
            heading: 'Co robimy — pełna obsługa zegarków premium',
            paragraphs: [
              'Sprzedaż zegarków premium — w stałej ekspozycji butiku znajdują się egzemplarze z głównych marek luksusowych: Rolex (Submariner, Daytona, GMT-Master, Datejust, Day-Date, Sky-Dweller, Yacht-Master, Explorer), Patek Philippe (Nautilus, Aquanaut, Calatrava, Annual Calendar, Twenty~4), Audemars Piguet (Royal Oak, Royal Oak Offshore, Code 11.59), oraz Omega, Cartier, Breitling, IWC, Chopard, Vacheron Constantin i inne renomowane marki.',
              'Sprowadzanie zegarków na zamówienie — jeśli szukasz konkretnej referencji, której nie ma w katalogu, możemy ją sprowadzić. Typowo w 7–30 dni przedstawiamy 1–3 egzemplarze pasujące do briefu (referencja, tarcza, materiał, rok produkcji, komplet papierów, budżet). To rozwiązanie dla klientów, którzy nie chcą czekać latami na liście oczekujących u autoryzowanego dilera.',
              'Skup zegarków — wstępną wycenę po zdjęciach przedstawiamy zwykle w 15 minut. Finalizację umawiamy w butiku przy Mokotowskiej 71 — gotówką lub przelewem tego samego dnia po obejrzeniu i weryfikacji egzemplarza. Skupujemy pojedyncze zegarki oraz całe kolekcje.',
              'Komis — alternatywa dla skupu, gdy zależy Ci na maksymalnej cenie i możesz poczekać. Twój zegarek prezentujemy w butiku i bazie naszych klientów; po sprzedaży pobieramy prowizję, a różnica między uzyskaną ceną a skupem trafia do Ciebie.',
              'Serwis i naprawy — konserwacja mechanizmu, regulacja, wymiana uszczelek, polerowanie koperty i bransolety. Obsługujemy zarówno zegarki kupione u nas, jak i egzemplarze z zewnątrz.',
              'Biżuteria i tworzenie kolekcji prywatnej — wsparcie merytoryczne dla klientów budujących prywatną kolekcję zegarków oraz oferta wybranej biżuterii premium.',
            ],
          },
          {
            heading: 'Jak pracujemy — proces od pierwszej rozmowy do zakupu',
            paragraphs: [
              'Pierwszy kontakt — telefonicznie (+48 604 501 000), mailowo (biuro@warszawskiczas.pl) lub przez formularz kontaktowy na stronie. Krótko opisujesz, czego szukasz albo co masz — odpowiadamy zwykle w tym samym dniu roboczym z pierwszym krokiem.',
              'Wizyta w butiku — po umówieniu spotkania przygotowujemy egzemplarze odpowiadające Twojemu briefowi. Konsultacja w prywatnej atmosferze, bez presji decyzji od razu. Możesz wrócić do domu z notatkami i przemyśleć decyzję. Pełną dokumentację (zdjęcia, opis stanu, dane techniczne) wysyłamy mailowo po wizycie.',
              'Finalizacja — zakup w butiku albo zdalnie z ubezpieczonym kurierem, z fakturą VAT i kompletem dokumentacji. Wsparcie posprzedażowe (pytania techniczne, serwis, wymiana paska / bransolety, wycena pod ubezpieczenie) — bezterminowo.',
            ],
          },
          {
            heading: 'Marki i obszary specjalizacji',
            paragraphs: [
              'Główne marki obsługiwane w butiku: Rolex (wszystkie kolekcje sportowe i dress), Patek Philippe (Nautilus, Aquanaut, Calatrava, komplikacje), Audemars Piguet (Royal Oak, Offshore, Concept, Code 11.59). Te trzy marki stanowią rdzeń obrotu w segmencie inwestycyjnym i kolekcjonerskim.',
              'Pełna lista marek w obrocie: Omega, Cartier, Breitling, IWC, Chopard, Vacheron Constantin, Hublot, Panerai, Jaeger-LeCoultre, Tudor, Zenith, TAG Heuer, Bvlgari, Piaget, Franck Muller, Girard-Perregaux i inne. Dla wybranych rzadszych marek (haute horlogerie niezależne, kolaboracje limitowane) prowadzimy konsultacje przy szczególnie wartościowych egzemplarzach.',
              'Specjalizacje merytoryczne: chronografy lotnicze (Daytona, Speedmaster, Navitimer), zegarki nurkowe (Submariner, Sea-Dweller, Aquanaut, Seamaster), sportowa stal premium (Nautilus, Royal Oak, Aquanaut, Overseas), klasyczne dress watches (Calatrava, Reverso, Saxonia, Tank), edycje limitowane i kolekcjonerskie.',
            ],
          },
        ]}
        highlights={[
          { title: 'Butik z fizyczną lokalizacją od 2019 roku', description: 'Mokotowska 71, Śródmieście Warszawy — prywatne konsultacje w stałym lokalu, nie online, nie marketplace, nie pop-up.' },
          { title: 'Indywidualne podejście', description: 'Bez presji decyzji od razu. Pełna dokumentacja egzemplarza mailowo, czas na decyzję, wsparcie posprzedażowe bezterminowe.' },
          { title: 'Pełna obsługa zegarków premium', description: 'Sprzedaż, sprowadzanie, skup, komis, serwis i naprawy — wszystko w jednym butiku, bez rozproszenia.' },
        ]}
        bulletsHeading="Krótko o butiku"
        bullets={[
          'Butik działa od 2019 roku w Śródmieściu Warszawy',
          'Stała lokalizacja: Mokotowska 71, 00-530 Warszawa (niedaleko placu Trzech Krzyży)',
          'Rynek wtórny — dobieramy egzemplarze niezależnie od listy oczekujących u autoryzowanych dilerów',
          'Pełen zakres usług: sprzedaż, sprowadzanie, skup, komis, serwis, biżuteria',
          'Główne marki: Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling, IWC, Chopard',
          'Konsultacje po polsku, angielsku i ukraińsku',
          'Kontakt: +48 604 501 000, biuro@warszawskiczas.pl',
          'Obecność w sieci: Facebook, Instagram, TikTok @warszawskiczas',
        ]}
        stepsHeading="Jak umówić wizytę"
        steps={[
          { title: 'Pierwszy kontakt', description: 'Telefon, mail lub formularz — czego szukasz, jaki budżet, kiedy chciałbyś przyjść.' },
          { title: 'Potwierdzenie wizyty', description: 'Potwierdzamy termin (zwykle w 24 godziny) i przygotowujemy egzemplarze pod Twój brief.' },
          { title: 'Konsultacja w butiku', description: 'Spotkanie w lokalu przy Mokotowskiej 71 — 30–90 minut, w prywatnej atmosferze.' },
          { title: 'Decyzja bez presji', description: 'Nie musisz decydować od razu. Pełną dokumentację dostarczymy mailowo po wizycie.' },
        ]}
        faq={[
          { q: 'Czy Warszawski Czas jest autoryzowanym dilerem Rolexa / Patek Philippe / Audemars Piguet?', a: 'Nie. Warszawski Czas jest niezależnym butikiem działającym na rynku wtórnym. Sprzedajemy używane zegarki luksusowe i sprowadzamy konkretne referencje od sprawdzonych dilerów europejskich oraz prywatnych właścicieli. Dla klienta oznacza to brak konieczności wpisu na listę oczekujących u autoryzowanego dealera.' },
          { q: 'Od kiedy działa butik?', a: 'Warszawski Czas działa od 2019 roku w stałej, fizycznej lokalizacji przy ulicy Mokotowskiej 71 w Śródmieściu Warszawy.' },
          { q: 'Czy można obejrzeć zegarki bez umówienia wizyty?', a: 'Możliwe, ale rekomendujemy wcześniejsze umówienie wizyty — pozwala to nam przygotować egzemplarze odpowiadające Twojemu briefowi i zarezerwować czas wyłącznie dla jednej rozmowy. Wizyty „z marszu" są możliwe w godzinach otwarcia, ale część egzemplarzy może być w danym momencie poza stałą ekspozycją.' },
          { q: 'Czy mogę sprzedać zegarek bez kupowania innego?', a: 'Tak. Skup zegarków jest niezależną usługą — wstępna wycena po zdjęciach w 15 minut, finalizacja tego samego dnia po wizycie w butiku, gotówką lub przelewem. Alternatywnie możesz przekazać zegarek do komisu — uzyskasz wyższą cenę, ale czas dotarcia do kupca jest dłuższy.' },
          { q: 'Czy obsługujecie klientów spoza Polski?', a: 'Tak. Konsultacje prowadzimy po polsku, angielsku i ukraińsku. Wysyłki realizujemy z ubezpieczonym kurierem na terenie UE oraz do Wielkiej Brytanii, Szwajcarii, Norwegii i Liechtensteinu.' },
          { q: 'Jak skontaktować się z butikiem?', a: 'Telefon: +48 604 501 000. E-mail: biuro@warszawskiczas.pl. Formularz kontaktowy: na stronie /kontakt. Media społecznościowe: Facebook, Instagram i TikTok pod nazwą @warszawskiczas.' },
        ]}
        closingHeading="Zapraszamy do butiku"
        closingText="Mokotowska 71, Warszawa — wizyty po wcześniejszym umówieniu. Konsultacje po polsku, angielsku i ukraińsku."
      />
    </>
  )
}
