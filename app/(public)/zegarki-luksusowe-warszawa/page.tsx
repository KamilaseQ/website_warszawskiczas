import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'zegarki-luksusowe-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki luksusowe Warszawa — butik premium, Mokotowska 71'
const DESCRIPTION =
  'Zegarki luksusowe w Warszawie. Certyfikowane egzemplarze Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier — z gwarancją autentyczności. Mokotowska 71.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: localizedAlternates(`/${SLUG}`, 'pl'),
  openGraph: { type: 'website', url: URL, title: TITLE, description: DESCRIPTION, siteName: 'Warszawski Czas', locale: 'pl_PL' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki luksusowe w Warszawie', serviceType: 'Sprzedaż zegarków luksusowych', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki luksusowe Warszawa')) }} />
      <SeoLanding
        eyebrow="Zegarki luksusowe · Warszawa"
        h1="Zegarki luksusowe w Warszawie"
        intro="Wyselekcjonowana kolekcja zegarków premium w butiku przy Mokotowskiej 71. Każdy egzemplarz przechodzi wieloetapową weryfikację autentyczności i otrzymuje 12-miesięczną gwarancję butiku. Modele dostępne od ręki i do sprowadzenia na zamówienie."
        primaryCtaLabel="Umów prywatną prezentację"
        source="landing-zegarki-luksusowe"
        highlights={[
          { title: 'Certyfikat autentyczności', description: 'Każdy zegarek z dokumentem opisującym referencję, stan, mechanizm i historię serwisową.' },
          { title: 'Gwarancja butiku', description: '12 miesięcy gwarancji na pracę mechanizmu, niezależnie od pozostałej gwarancji producenta.' },
          { title: 'Modele na zamówienie', description: 'Nie znalazłeś referencji? Sprowadzamy konkretne modele dla klientów z Warszawy i całej Polski.' },
        ]}
        bulletsHeading="Co znajdziesz w butiku"
        bullets={[
          'Modele dostępne od ręki — do obejrzenia i pomiaru w butiku',
          'Egzemplarze z kompletem papierów i pudełka',
          'Modele kolekcjonerskie i edycje limitowane',
          'Wybrane zegarki vintage z udokumentowanym pochodzeniem',
          'Możliwość rezerwacji i transakcji zdalnej z ubezpieczonym kurierem',
        ]}
        brandsHeading="Marki w stałej ofercie"
        brands={['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin', 'Breitling', 'Panerai', 'Tudor', 'TAG Heuer']}
        stepsHeading="Jak wygląda zakup"
        steps={[
          { title: 'Wybór modelu', description: 'Przeglądasz katalog lub mówisz nam, czego szukasz.' },
          { title: 'Prywatna prezentacja', description: 'Spotkanie w butiku przy Mokotowskiej 71.' },
          { title: 'Weryfikacja', description: 'Pokazujemy dokumenty, historię i wynik kontroli.' },
          { title: 'Finalizacja', description: 'Zakup w butiku albo zdalnie — z gwarancją i certyfikatem.' },
        ]}
        faq={[
          { q: 'Czy zegarki są nowe czy używane?', a: 'Mamy oba rodzaje. Większość katalogu to certyfikowane egzemplarze z drugiej ręki w bardzo dobrym stanie.' },
          { q: 'Czy mogę zarezerwować zegarek przed wizytą?', a: 'Tak. Po krótkiej rozmowie odkładamy konkretny egzemplarz na 24–48 godzin.' },
          { q: 'Czy istnieje możliwość zwrotu?', a: 'Tak — w przypadku stwierdzenia rozbieżności ze stanem opisanym. Szczegóły omawiamy indywidualnie.' },
          { q: 'Czy sprowadzicie konkretną referencję?', a: 'Tak. Korzystamy z sieci sprawdzonych dostawców w Polsce i Europie. Czas zwykle 7–30 dni.' },
        ]}
        closingHeading="Zapraszamy do butiku"
        closingText="Umów prywatną prezentację — przygotujemy modele odpowiadające Twoim oczekiwaniom."
        relatedLinks={[
          { href: '/produkty', label: 'Cały katalog' },
          { href: '/zegarki-uzywane-warszawa', label: 'Zegarki używane' },
          { href: '/zegarki-na-zamowienie', label: 'Zegarki na zamówienie' },
        ]}
      />
    </>
  )
}
