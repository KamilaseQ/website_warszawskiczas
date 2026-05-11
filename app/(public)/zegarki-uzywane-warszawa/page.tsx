import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'zegarki-uzywane-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki używane Warszawa — certyfikowane, z gwarancją'
const DESCRIPTION =
  'Używane zegarki luksusowe w Warszawie. Każdy egzemplarz przechodzi wieloetapową weryfikację autentyczności i otrzymuje 12-miesięczną gwarancję butiku.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Sprzedaż używanych zegarków luksusowych w Warszawie', serviceType: 'Sprzedaż zegarków używanych', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki używane Warszawa')) }} />
      <SeoLanding
        eyebrow="Zegarki używane · Warszawa"
        h1="Używane zegarki premium z gwarancją"
        intro="Każdy zegarek z drugiej ręki w Warszawskim Czasie przechodzi wieloetapową weryfikację: kontrolę mechanizmu, autentyczności oznaczeń, pomiarów chronometrycznych i pochodzenia. Otrzymujesz pełną dokumentację, certyfikat i 12 miesięcy gwarancji."
        primaryCtaLabel="Zobacz dostępne modele"
        source="landing-zegarki-uzywane"
        highlights={[
          { title: 'Wieloetapowa weryfikacja', description: 'Mechanizm, oznaczenia, pomiary chronometryczne, porównanie z bazą referencji.' },
          { title: '12 miesięcy gwarancji', description: 'Gwarancja butiku na pracę mechanizmu — niezależnie od pozostałej gwarancji producenta.' },
          { title: 'Pełna historia', description: 'Pokazujemy papiery, ślady serwisowe i rzeczowe informacje o pochodzeniu egzemplarza.' },
        ]}
        bulletsHeading="Co zyskujesz przy zakupie"
        bullets={[
          'Cena zwykle 20–40% niższa niż w salonie autoryzowanym',
          'Modele niedostępne w autoryzowanych salonach (lista oczekujących)',
          'Pewność pochodzenia i autentyczności',
          'Gwarancja na pracę mechanizmu',
          'Możliwość wymiany pasków, ogniw, serwisu w jednym miejscu',
        ]}
        brandsHeading="Marki w obrocie"
        brands={['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin', 'Breitling', 'Panerai', 'Tudor']}
        stepsHeading="Bezpieczny zakup w 4 krokach"
        steps={[
          { title: 'Wybór', description: 'Wybierasz model z katalogu lub zlecasz poszukiwanie.' },
          { title: 'Weryfikacja', description: 'Pokazujemy wynik kontroli i dokumentację.' },
          { title: 'Prezentacja', description: 'Oględziny w butiku albo zdalnie — wideo + zdjęcia 360°.' },
          { title: 'Gwarancja', description: 'Otrzymujesz certyfikat autentyczności i 12 miesięcy gwarancji.' },
        ]}
        faq={[
          { q: 'Co dostaję w komplecie?', a: 'Zegarek, pudełko (jeśli zachowane), papiery (jeśli zachowane), certyfikat butiku, instrukcję gwarancji.' },
          { q: 'Czy mogę zwrócić zegarek?', a: 'Tak — w przypadku rozbieżności ze stanem opisanym. Warunki ustalamy indywidualnie.' },
          { q: 'Czy serwisujecie zegarki kupione u Was?', a: 'Tak — w naszym warsztacie zegarmistrzowskim, na warunkach preferencyjnych dla stałych klientów.' },
        ]}
        closingHeading="Sprawdź dostępne egzemplarze"
        relatedLinks={[
          { href: '/produkty', label: 'Cały katalog' },
          { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe' },
          { href: '/zegarki-na-zamowienie', label: 'Zegarki na zamówienie' },
        ]}
      />
    </>
  )
}
