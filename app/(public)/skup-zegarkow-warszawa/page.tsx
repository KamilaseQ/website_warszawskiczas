import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'skup-zegarkow-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Skup zegarków Warszawa — wycena w 15 minut, gotówka lub przelew'
const DESCRIPTION =
  'Skup zegarków premium w Warszawie. Bezpłatna wycena w 15 minut, natychmiastowa płatność, pełna dyskrecja. Rolex, Patek Philippe, AP, Omega — Mokotowska 71.'

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
  },
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
              name: 'Skup zegarków premium w Warszawie',
              serviceType: 'Skup zegarków',
              description: DESCRIPTION,
              url: URL,
              areaServed: 'Warszawa',
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Skup zegarków Warszawa')),
        }}
      />
      <SeoLanding
        eyebrow="Skup zegarków · Warszawa"
        h1="Skup zegarków luksusowych w Warszawie"
        intro="Sprzedasz zegarek bez pośredników i bez aukcji. Wstępna wycena po zdjęciach w 15 minut, finalizacja w butiku przy Mokotowskiej 71 — gotówka lub przelew tego samego dnia."
        primaryCtaLabel="Wyceń zegarek"
        source="landing-skup-zegarkow-warszawa"
        highlights={[
          { title: 'Wycena w 15 minut', description: 'Wyślij zdjęcia tarczy, koperty i mechanizmu — wstępną cenę przekazujemy w ciągu kwadransa.' },
          { title: 'Gotówka lub przelew', description: 'Płatność tego samego dnia po oględzinach. Bez ukrytych prowizji i bez czekania na licytacje.' },
          { title: 'Pełna dyskrecja', description: 'Transakcja w prywatnej części butiku. Nie ujawniamy danych klientów ani szczegółów wyceny osobom trzecim.' },
        ]}
        bulletsHeading="Co skupujemy"
        bullets={[
          'Zegarki mechaniczne wszystkich marek premium — sprawne, do serwisu, vintage i współczesne',
          'Zegarki z kompletnymi papierami i pudełkiem — i bez',
          'Modele kolekcjonerskie i edycje limitowane',
          'Zegarki ze złota, platyny i stali z dodatkami szlachetnymi',
          'Zegarki w komplecie z bransoletą i z paskami zamiennymi',
        ]}
        brandsHeading="Marki, które skupujemy najczęściej"
        brands={[
          'Rolex',
          'Patek Philippe',
          'Audemars Piguet',
          'Omega',
          'Cartier',
          'IWC',
          'Jaeger-LeCoultre',
          'Vacheron Constantin',
          'Breitling',
          'Panerai',
          'Tudor',
          'TAG Heuer',
        ]}
        stepsHeading="Jak wygląda skup krok po kroku"
        steps={[
          { title: 'Kontakt i zdjęcia', description: 'Wyślij zdjęcia i opis (marka, ref., komplet) WhatsAppem, mailem lub formularzem.' },
          { title: 'Wstępna wycena', description: 'W 15 minut otrzymasz orientacyjną cenę bazującą na rynku i stanie egzemplarza.' },
          { title: 'Spotkanie w butiku', description: 'Oględziny przy Mokotowskiej 71 lub w innym uzgodnionym miejscu w Warszawie.' },
          { title: 'Finalizacja i płatność', description: 'Akceptujesz cenę — wypłacamy gotówkę lub przelew tego samego dnia.' },
        ]}
        faq={[
          { q: 'Czy wycena jest płatna?', a: 'Nie. Wstępna wycena po zdjęciach i wycena w butiku są bezpłatne i niezobowiązujące.' },
          { q: 'Co podnosi wartość zegarka przy skupie?', a: 'Komplet papierów i pudełka, oryginalne ogniwa, świeży serwis u producenta, niski przebieg, rzadkość referencji i dobry stan koperty.' },
          { q: 'Czy skupujecie zegarki bez papierów?', a: 'Tak. W przypadku braku papierów weryfikujemy autentyczność na miejscu — to nie wyklucza transakcji, ale wpływa na wycenę.' },
          { q: 'Czy mogę sprzedać zegarek zdalnie?', a: 'Tak — po wstępnej wycenie po zdjęciach uzgadniamy bezpieczną wysyłkę kurierską z ubezpieczeniem.' },
          { q: 'Jak szybko wypłacacie pieniądze?', a: 'Po akceptacji ceny — gotówka od ręki w butiku lub przelew tego samego dnia.' },
        ]}
        closingHeading="Wycena bez zobowiązań"
        closingText="Wyślij zdjęcia zegarka — wstępną cenę przekazujemy w 15 minut. Jeśli zaakceptujesz, finalizujemy transakcję tego samego dnia."
        relatedLinks={[
          { href: '/skup-rolex-warszawa', label: 'Skup Rolex Warszawa' },
          { href: '/wycena-zegarka-warszawa', label: 'Wycena zegarka' },
          { href: '/komis-zegarkow-warszawa', label: 'Komis zegarków' },
        ]}
      />
    </>
  )
}
