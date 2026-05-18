import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'jak-weryfikujemy-autentycznosc-zegarka'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Jak weryfikujemy autentyczność zegarka — proces ekspertyzy Warszawski Czas'
const DESCRIPTION =
  'Pełen proces weryfikacji autentyczności luksusowych zegarków w butiku Warszawski Czas — wizualna ocena, oznaczenia koperty, mechanizm, dokumenty, historia serwisowa, kompletność. Każdy zegarek sprawdzany przed wpisaniem do katalogu. Mokotowska 71.'

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
    images: [{ url: 'https://warszawskiczas.pl/opengraph-image.jpg', alt: 'Weryfikacja autentyczności zegarka — Warszawski Czas' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/opengraph-image.jpg'] },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Weryfikacja autentyczności zegarka', serviceType: 'Ekspertyza zegarmistrzowska', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Jak weryfikujemy autentyczność zegarka')) }} />

      <SeoLanding
        eyebrow="Proces · Ekspertyza zegarmistrzowska"
        h1="Jak weryfikujemy autentyczność zegarka"
        intro="Każdy zegarek trafiający do butiku Warszawski Czas — z zakupu, sprowadzania, skupu czy komisu — przechodzi wieloetapowy proces weryfikacji autentyczności i stanu. Sprawdzamy wizualnie, porównujemy oznaczenia, analizujemy mechanizm, weryfikujemy dokumenty i kompletność zestawu. Dopiero po pozytywnym przejściu wszystkich etapów zegarek trafia do katalogu lub do klienta. Poniżej opisujemy, co konkretnie sprawdzamy."
        primaryCtaLabel="Umów ekspertyzę"
        source="landing-weryfikacja-autentycznosci"
        body={[
          {
            heading: 'Dlaczego weryfikacja autentyczności jest dziś tak ważna',
            paragraphs: [
              'Rynek wtórny zegarków luksusowych — Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling — to obecnie jeden z najbardziej dochodowych segmentów rynku dóbr luksusowych w Europie. Wraz ze wzrostem rynku rośnie też skala podróbek: od grubych chińskich replik po precyzyjne „Frankenwatche" złożone z autentycznych i nieautentycznych części. Fabryczne podróbki są dziś wykonywane z dokładnością, którą bez specjalistycznych narzędzi trudno odróżnić od oryginału.',
              'Każdy zegarek, który trafia do butiku Warszawski Czas — niezależnie od źródła — przechodzi wieloetapowy proces weryfikacji. Nie ufamy żadnemu pojedynczemu sygnałowi. Sprawdzamy mechanizm, kopertę, tarczę, bransoletę, dokumenty, historię serwisową oraz kompletność zestawu. Dla najbardziej spornych egzemplarzy konsultujemy się z niezależnymi zegarmistrzami i, jeśli to konieczne, kierujemy zegarek do oficjalnego serwisu danej marki.',
              'Klient otrzymuje zegarek z opisem stanu i przeprowadzonej weryfikacji oraz wsparciem posprzedażowym — w tym pomocą w serwisie, ewentualnej regulacji oraz dostępem do butiku w razie pytań technicznych po zakupie.',
            ],
          },
          {
            heading: 'Krok 1 — wstępna ocena wizualna pod kontrolowanym oświetleniem',
            paragraphs: [
              'Zegarek trafia najpierw do studia ekspertyzy przy Mokotowskiej 71 — pod kontrolowane oświetlenie i lupy zegarmistrzowskie. Wykonujemy serię fotografii w wysokiej rozdzielczości: tarcza pod różnymi kątami, koperta od strony tylnej, bok koperty (proporcje, rzeźbienia), bransoleta (zapięcie, ogniwa) oraz oznaczenia między ogniwami.',
              'Na tym etapie odsiewamy oczywiste podróbki: nieprawidłowe proporcje koperty, niewłaściwy krój czcionki na tarczy, niezgodne kolory tarczy, brakujące rzeźbienia, błędy ortograficzne w napisach. Bardziej zaawansowane podróbki przechodzą etap 1 — dlatego nigdy nie kończymy weryfikacji na tym kroku.',
            ],
          },
          {
            heading: 'Krok 2 — kontrola oznaczeń koperty i numerów seryjnych',
            paragraphs: [
              'Każda marka luksusowa ma własny system oznaczania koperty. Rolex od 2010 roku wytrawia numer seryjny między ogniwami „12 godzin" oraz na rancie koperty. Patek Philippe stosuje numery seryjne na boku koperty i na mechanizmie. Audemars Piguet umieszcza numery na tylnej części koperty Royal Oaka oraz na mostku. Omega — na zewnętrznej części koperty i na mechanizmie.',
              'Weryfikujemy zgodność numeru seryjnego z deklarowanym rokiem produkcji oraz spójność numeru seryjnego z numerem na karcie gwarancyjnej i papierach. Sprawdzamy też samo wytrawienie — autentyczne grawerunki mają charakterystyczną głębokość, ostrość i precyzję. Podróbki często mają wytrawienie laserowe, płytsze i nierównomierne.',
            ],
          },
          {
            heading: 'Krok 3 — analiza mechanizmu',
            paragraphs: [
              'Otwieramy zegarek od strony koperty tylnej (lub przez przód w wybranych modelach) i analizujemy mechanizm pod lupą zegarmistrzowską. Każda marka ma charakterystyczne wykończenie i oznaczenia kalibrów: Rolex — Calibre 3135, 3235, 3186, 4130 (Daytona) z Côtes de Genève, rzeźbionym rotorem i charakterystycznymi grawerami. Patek Philippe — kalibry 240 (mikrorotor), 324, 26-330, 28-520 (Annual Calendar), CH 28-520 (Chronograph) z anglage, perlage i pieczęcią Patek Seal. Audemars Piguet — kalibry 3120, 4302, 4401 (Chronograph), 7121 (Royal Oak 15510) z rotorem 22K i Côtes de Genève.',
              'Każda niezgodność z fabryczną specyfikacją mechanizmu — zły kalibr, niewłaściwe wykończenie, niezgodność numeru mechanizmu z numerem koperty, brakujące oznaczenia — jest sygnałem do dalszej, pogłębionej weryfikacji lub odrzucenia egzemplarza.',
            ],
          },
          {
            heading: 'Krok 4 — sprawdzenie chodu i wodoszczelności',
            paragraphs: [
              'Sprawdzamy parametry chronometryczne mechanizmu — dokładność dobową w kilku pozycjach (każda marka ma swoje deklarowane tolerancje: Rolex ±2 s/dobę, Patek Philippe ±3/-2 s/dobę, AP ±4 s/dobę), amplitudę balansu oraz zachowanie w różnych pozycjach. Mechanizm chodzący poza specyfikacją to sygnał, że wymaga serwisu albo że nie jest tym, czym deklaruje sprzedający.',
              'Dla zegarków deklarowanych jako wodoszczelne sprawdzamy stan uszczelek i — w razie wątpliwości — kierujemy egzemplarz na test ciśnieniowy do współpracującego serwisu zegarmistrzowskiego. Każdy zegarek, który nie spełnia deklarowanej wodoszczelności, dostaje informację w opisie i, jeśli to potrzebne, wymianę uszczelek przed sprzedażą.',
            ],
          },
          {
            heading: 'Krok 5 — weryfikacja dokumentów, papierów i historii serwisowej',
            paragraphs: [
              'Sprawdzamy autentyczność karty gwarancyjnej (od 2020 roku Rolex używa kart elektronicznych z chipem; Patek Philippe stosuje karty z hologramami i nadrukowanymi danymi), zgodność danych na karcie z zegarkiem (numer seryjny, model, data zakupu, autoryzowany sprzedawca) oraz autentyczność stempli serwisowych. Dla starszych egzemplarzy weryfikujemy oryginalne papiery COSC, instrukcje i certyfikaty.',
              'Historia serwisowa — przeglądy w autoryzowanych Service Center lub u niezależnych zegarmistrzów, zgodność dat z deklarowanym użytkowaniem, ewentualne wymiany części (tarcza, bransoleta, korona) — wszystko jest istotne dla finalnej wyceny i opisu egzemplarza.',
            ],
          },
          {
            heading: 'Krok 6 — kompletność zestawu i ocena handlowa',
            paragraphs: [
              'Po zakończeniu weryfikacji technicznej oceniamy kompletność zestawu: pudełko zewnętrzne, pudełko wewnętrzne, instrukcja, karta gwarancyjna, dodatkowe ogniwa bransolety, świadectwo COSC, etykieta zawieszkowa, woreczek na zegarek. Pełen „full set" istotnie wpływa na wartość rynkową — dla niektórych referencji nawet 15–25%.',
              'Następnie opisujemy stan zegarka (Nowy / Nowy z otwartego pudełka / Bardzo dobry / Dobry / Vintage) z wymienieniem konkretnych śladów użytkowania: drobne rysy na bezelu, polerowanie koperty w przeszłości, ślady na bransolecie, stan korony i tłoczków. Klient ma pełen obraz egzemplarza jeszcze przed wizytą w butiku — pełną dokumentację (zdjęcia + opis) wysyłamy mailowo.',
            ],
          },
          {
            heading: 'Krok 7 — przy wątpliwościach kierowanie do oficjalnego serwisu marki',
            paragraphs: [
              'Dla egzemplarzy bez papierów, z niespójnościami w numerze seryjnym lub w przypadku rzadkich / archiwalnych modeli (np. vintage Rolexy „Bubbleback", archiwalne Patek Philippe, wczesne Royal Oaki A-Series) możemy skierować zegarek do oficjalnego serwisu danej marki w celu pełnej weryfikacji. Patek Philippe oferuje w Genewie procedurę Extract from the Archives — dokument potwierdzający autentyczność egzemplarza z bazy historycznej manufaktury.',
              'Ten krok wydłuża proces o kilka tygodni i ma swój koszt, ale dla klienta szukającego rzadkiego, kolekcjonerskiego zegarka to gwarancja, której nie zastąpi żadna inna ekspertyza. Decyzja, czy taki krok zlecać, zapada zawsze wspólnie z klientem.',
            ],
          },
        ]}
        highlights={[
          { title: 'Wieloetapowa weryfikacja', description: 'Wizualna ocena, oznaczenia koperty, mechanizm, parametry chronometryczne, dokumenty, kompletność — wszystko sprawdzane przed wpisaniem do katalogu.' },
          { title: 'Współpraca z serwisami specjalistycznymi', description: 'Dla wątpliwych lub rzadkich egzemplarzy korzystamy z konsultacji niezależnych zegarmistrzów oraz oficjalnych serwisów marki (Patek Philippe Extract from the Archives, Rolex Service Center).' },
          { title: 'Pełna dokumentacja egzemplarza', description: 'Klient otrzymuje opis stanu zegarka, przebieg weryfikacji oraz wsparcie posprzedażowe — bezterminowo, także po zakupie.' },
        ]}
        bulletsHeading="Co dokładnie sprawdzamy"
        bullets={[
          'Proporcje, krój czcionki i oznaczenia tarczy pod kontrolowanym oświetleniem',
          'Numer seryjny koperty i jego zgodność z deklarowanym rocznikiem produkcji',
          'Mechanizm pod lupą zegarmistrzowską — kalibr, wykończenie, rotor, numer mechanizmu',
          'Parametry chodu — dokładność dobowa w kilku pozycjach, amplituda balansu',
          'Stan uszczelek i wodoszczelność zgodna z deklarowaną głębokością',
          'Autentyczność karty gwarancyjnej, papierów COSC i stempli serwisowych',
          'Kompletność zestawu — pudełko, dokumenty, dodatkowe ogniwa, instrukcja',
          'Historia serwisowa i ewentualne wymiany części (tarcza, bransoleta, korona)',
        ]}
        stepsHeading="Skrócony przebieg ekspertyzy"
        steps={[
          { title: 'Wstępna konsultacja', description: 'Krótka rozmowa po zdjęciach (telefon, mail, formularz) — czy zegarek kwalifikuje się do pełnej ekspertyzy.' },
          { title: 'Wizyta w butiku', description: 'Pełna weryfikacja w studiu ekspertyzy przy Mokotowskiej 71. Zwykle 1–2 godziny.' },
          { title: 'Serwis specjalistyczny (opcjonalnie)', description: 'Dla wątpliwych lub rzadkich egzemplarzy — konsultacja zewnętrzna lub Extract from the Archives. Kilka tygodni.' },
          { title: 'Pełen opis stanu', description: 'Otrzymujesz dokumentację przebiegu weryfikacji oraz opis stanu zegarka. Wsparcie posprzedażowe bezterminowe.' },
        ]}
        faq={[
          { q: 'Czy oferujecie ekspertyzę zegarka, który nie został kupiony w Warszawskim Czasie?', a: 'Tak. Oferujemy płatną ekspertyzę zegarków zewnętrznych — przed zakupem na rynku wtórnym, przed sprzedażą, przed darowizną lub spadkiem, albo dla potwierdzenia autentyczności posiadanego egzemplarza. Cenę ekspertyzy ustalamy indywidualnie na podstawie zakresu i marki.' },
          { q: 'Jak długo trwa weryfikacja zegarka?', a: 'Podstawowa weryfikacja trwa 1–2 godziny w butiku przy Mokotowskiej 71. Pełna weryfikacja z włączeniem oficjalnego serwisu marki (Extract from the Archives w Patek Philippe Geneva, Rolex Service Center) zajmuje dodatkowo kilka tygodni. Większość zegarków trafiających do katalogu jest weryfikowana w czasie do 7 dni.' },
          { q: 'Czy weryfikacja gwarantuje autentyczność w 100%?', a: 'Nie ma w branży 100% gwarancji autentyczności bez fizycznej wizyty w fabryce marki — i nawet tam zdarzają się trudne przypadki „Frankenwatchy" złożonych z autentycznych części. Nasz proces minimalizuje ryzyko do akceptowalnego poziomu i jest na tyle rzetelny, że jesteśmy w stanie zaoferować pełną odpowiedzialność za każdy zegarek z naszego katalogu.' },
          { q: 'Co robicie, jeśli zegarek okaże się podrobiony?', a: 'Zegarek nie trafia do katalogu. W przypadku skupu — informujemy właściciela o wyniku weryfikacji i nie kupujemy egzemplarza. W przypadku komisu — odsyłamy zegarek właścicielowi z opisem zastrzeżeń. Nigdy nie sprzedajemy podróbek ani egzemplarzy o wątpliwej autentyczności.' },
          { q: 'Czy mogę przyjechać z zegarkiem bez wcześniejszego umówienia?', a: 'Możliwe, ale rekomendujemy umówienie wizyty z wyprzedzeniem. Pozwala to nam zarezerwować czas wyłącznie na Twoją ekspertyzę i zaprosić ewentualnie dodatkowego konsultanta zegarmistrzowskiego, jeśli zegarek tego wymaga.' },
        ]}
        closingHeading="Zamów ekspertyzę swojego zegarka"
        closingText="Pełna weryfikacja autentyczności w butiku przy Mokotowskiej 71 — opis stanu, dokumentacja i wsparcie posprzedażowe."
      />
    </>
  )
}
