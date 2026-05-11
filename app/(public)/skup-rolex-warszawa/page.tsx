import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'skup-rolex-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Skup Rolex Warszawa — sprzedaj Rolexa bez pośredników'
const DESCRIPTION =
  'Skup Rolex w Warszawie. Submariner, Daytona, Datejust, GMT-Master, Day-Date, Sky-Dweller — bezpłatna wycena, gotówka lub przelew tego samego dnia, pełna dyskrecja.'

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: 'Skup zegarków Rolex w Warszawie',
              serviceType: 'Skup zegarków Rolex',
              description: DESCRIPTION,
              url: URL,
              areaServed: 'Warszawa',
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Skup Rolex Warszawa')) }}
      />
      <SeoLanding
        eyebrow="Skup Rolex · Warszawa"
        h1="Skup Rolex w Warszawie — szybko, dyskretnie, bez pośredników"
        intro="Specjalizujemy się w skupie Rolexów. Wycena każdej referencji w 15 minut, oględziny w butiku przy Mokotowskiej 71, gotówka lub przelew tego samego dnia. Nie jesteśmy autoryzowanym dealerem Rolex — działamy na rynku wtórnym."
        primaryCtaLabel="Sprzedaj Rolexa"
        source="landing-skup-rolex-warszawa"
        highlights={[
          { title: 'Każda referencja', description: 'Submariner, Daytona, Datejust, GMT-Master II, Day-Date, Sky-Dweller, Yacht-Master, Explorer, Sea-Dweller, Air-King.' },
          { title: 'Wycena rynkowa', description: 'Ceny oparte na aktualnych notowaniach Chrono24, WatchCharts i transakcjach krajowych — bez „lombardowych” obniżek.' },
          { title: 'Bezpieczna transakcja', description: 'Spotkanie w butiku albo bezpieczna wysyłka kurierska z pełnym ubezpieczeniem zegarka na czas transportu.' },
        ]}
        bulletsHeading="Modele Rolex, które skupujemy najczęściej"
        bullets={[
          'Submariner — Date, No Date, Hulk, Kermit, Smurf',
          'Daytona — stalowe, z białą i czarną tarczą, Le Mans, edycje meteorytowe',
          'Datejust — 36, 41, Wimbledon, Tapestry, biało-różowe, dwukolorowe',
          'GMT-Master II — Pepsi, Batman, Coke, Root Beer, Sprite',
          'Day-Date — President, Olive Roman, gradient',
          'Sky-Dweller, Yacht-Master, Explorer, Sea-Dweller, Air-King',
        ]}
        brandsHeading="Skupujemy też zegarki innych marek"
        brands={['Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'Vacheron Constantin', 'Jaeger-LeCoultre', 'IWC', 'Breitling']}
        stepsHeading="Jak sprzedać Rolexa w 4 krokach"
        steps={[
          { title: 'Zdjęcia + ref.', description: 'Wyślij zdjęcia tarczy, koperty, papierów i numer referencji.' },
          { title: 'Wycena 15 minut', description: 'Otrzymasz orientacyjną cenę i przedział oferty końcowej.' },
          { title: 'Oględziny', description: 'Spotkanie w butiku przy Mokotowskiej 71 lub bezpieczna wysyłka kurierska.' },
          { title: 'Wypłata', description: 'Akceptujesz cenę — gotówka albo przelew jeszcze tego samego dnia.' },
        ]}
        faq={[
          { q: 'Czy skupujecie Rolexa bez papierów?', a: 'Tak. Brak kart i pudełka nie wyklucza transakcji, ale obniża cenę o 5–15% w zależności od referencji. Autentyczność weryfikujemy w butiku.' },
          { q: 'Ile trwa wycena Rolexa?', a: 'Wstępna wycena po zdjęciach: 15 minut. Wycena ostateczna podczas oględzin: do 30 minut.' },
          { q: 'Czy wycena jest bezpłatna?', a: 'Tak. Wycena wstępna i wycena w butiku są bezpłatne, niezobowiązujące i nie wymagają sprzedaży.' },
          { q: 'Czy możliwa jest sprzedaż zdalna?', a: 'Tak — po wycenie wstępnej organizujemy ubezpieczonego kuriera. Płatność realizujemy po pozytywnej weryfikacji w butiku.' },
          { q: 'Czy jesteście autoryzowanym dealerem Rolex?', a: 'Nie. Warszawski Czas działa na rynku wtórnym i nie jest autoryzowanym dealerem Rolex SA.' },
        ]}
        closingHeading="Wyceń Rolexa bez zobowiązań"
        closingText="Wyślij zdjęcia i numer referencji — wstępną ofertę poznasz w 15 minut. Bez prowizji, bez aukcji, bez czekania."
        relatedLinks={[
          { href: '/skup-zegarkow-warszawa', label: 'Skup zegarków Warszawa' },
          { href: '/zegarki-rolex-warszawa', label: 'Zegarki Rolex Warszawa' },
          { href: '/rolex-na-zamowienie', label: 'Rolex na zamówienie' },
        ]}
      />
    </>
  )
}
