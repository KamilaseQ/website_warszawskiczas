import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'komis-zegarkow-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Komis zegarków Warszawa — sprzedaż dyskretna i premium'
const DESCRIPTION =
  'Komis zegarków premium w Warszawie. Wyższa cena niż w skupie, prezentacja butikowa, dotarcie do kolekcjonerów. Rolex, Patek, AP, Omega — Mokotowska 71.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Komis zegarków premium w Warszawie', serviceType: 'Komis zegarków', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Komis zegarków Warszawa')) }} />
      <SeoLanding
        eyebrow="Komis zegarków · Warszawa"
        h1="Komis zegarków luksusowych w Warszawie"
        intro="Chcesz uzyskać wyższą cenę niż w skupie i jesteś gotów poczekać? Zostaw zegarek w komisie Warszawskiego Czasu — prezentujemy go w butiku i kierujemy do kolekcjonerów z naszej bazy. Pełna kontrola nad ceną minimalną."
        primaryCtaLabel="Oddaj zegarek w komis"
        source="landing-komis-warszawa"
        highlights={[
          { title: 'Wyższa cena', description: 'Sprzedaż detaliczna zamiast skupu — typowo 10–20% więcej niż oferta natychmiastowa.' },
          { title: 'Prezentacja butikowa', description: 'Zegarek prezentowany w butiku przy Mokotowskiej 71, na stronie i w komunikacji do bazy klientów.' },
          { title: 'Dyskrecja', description: 'Nie ujawniamy danych właściciela. Negocjacje i transakcję prowadzimy w jego imieniu.' },
        ]}
        bulletsHeading="Co zyskujesz oddając zegarek w komis"
        bullets={[
          'Wyższa cena końcowa niż w skupie natychmiastowym',
          'Profesjonalne zdjęcia i opis kolekcjonerski',
          'Dotarcie do bazy stałych klientów Warszawskiego Czasu',
          'Pełna kontrola nad ceną minimalną i czasem ekspozycji',
          'Brak ryzyka — w każdym momencie możesz wycofać zegarek',
        ]}
        brandsHeading="Marki w komisie"
        brands={['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin', 'Breitling', 'Panerai']}
        stepsHeading="Jak wygląda komis"
        steps={[
          { title: 'Wycena', description: 'Ustalamy realną cenę rynkową i cenę minimalną akceptowaną przez właściciela.' },
          { title: 'Umowa komisowa', description: 'Podpisujemy prostą umowę określającą cenę, prowizję i warunki ekspozycji.' },
          { title: 'Sprzedaż', description: 'Zegarek trafia do butiku i komunikacji. Negocjujemy w imieniu właściciela.' },
          { title: 'Rozliczenie', description: 'Po sprzedaży wypłacamy uzgodnioną kwotę — gotówka lub przelew.' },
        ]}
        faq={[
          { q: 'Skup czy komis — co wybrać?', a: 'Skup, gdy potrzebujesz pieniędzy od ręki. Komis, gdy chcesz uzyskać maksymalną cenę i możesz poczekać kilka tygodni.' },
          { q: 'Jaka jest prowizja?', a: 'Ustalamy ją indywidualnie — typowo 8–15% w zależności od marki, ceny i przewidywanego czasu sprzedaży.' },
          { q: 'Ile trwa sprzedaż w komisie?', a: 'Najczęściej od kilku dni do kilku tygodni. Modele rzadkie i wycenione realnie sprzedają się szybciej.' },
          { q: 'Czy mogę wycofać zegarek w trakcie?', a: 'Tak. W każdym momencie możesz wycofać zegarek bez kar i kosztów (jeśli nie został właśnie zarezerwowany przez kupującego).' },
        ]}
        closingHeading="Porozmawiajmy o Twoim zegarku"
        closingText="Po krótkiej wycenie wspólnie zdecydujemy, czy lepszym wyborem będzie komis, czy skup natychmiastowy."
        relatedLinks={[
          { href: '/skup-zegarkow-warszawa', label: 'Skup zegarków' },
          { href: '/wycena-zegarka-warszawa', label: 'Wycena zegarka' },
        ]}
      />
    </>
  )
}
