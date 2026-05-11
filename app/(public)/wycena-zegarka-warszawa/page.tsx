import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'wycena-zegarka-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Wycena zegarka Warszawa — bezpłatnie w 15 minut'
const DESCRIPTION =
  'Profesjonalna wycena zegarka w Warszawie. Bezpłatnie, niezobowiązująco, na podstawie zdjęć lub w butiku. Rolex, Patek, AP, Omega, Cartier — Mokotowska 71.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Wycena zegarka w Warszawie', serviceType: 'Wycena zegarków', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Wycena zegarka Warszawa')) }} />
      <SeoLanding
        eyebrow="Wycena zegarka · Warszawa"
        h1="Profesjonalna wycena zegarka w Warszawie"
        intro="Zastanawiasz się, ile wart jest Twój zegarek? Bezpłatnie wycenimy każdy mechaniczny zegarek premium na podstawie zdjęć w 15 minut albo na miejscu w butiku przy Mokotowskiej 71. Bez zobowiązań do sprzedaży."
        primaryCtaLabel="Wyceń zegarek"
        source="landing-wycena-zegarka"
        highlights={[
          { title: 'Wycena po zdjęciach', description: 'Wyślij zdjęcia tarczy, koperty, mechanizmu i papierów — orientacyjną wartość poznasz w 15 minut.' },
          { title: 'Wycena na miejscu', description: 'W butiku weryfikujemy stan, mechanizm i komplet — wycena ostateczna w ciągu 30 minut.' },
          { title: 'Bez zobowiązań', description: 'Wycena nigdy nie wymaga sprzedaży. To informacja do podjęcia świadomej decyzji.' },
        ]}
        bulletsHeading="Co wpływa na wartość zegarka"
        bullets={[
          'Marka, model i konkretna referencja',
          'Rok produkcji i dostępność na rynku wtórnym',
          'Stan koperty, tarczy, bransolety i mechanizmu',
          'Komplet papierów, pudełka, dodatkowych ogniw',
          'Historia serwisowa — przeglądy autoryzowane vs. niezależne',
          'Modyfikacje, polerki, niefabryczne części (zwykle obniżają wartość)',
        ]}
        brandsHeading="Wyceniamy zegarki marek"
        brands={['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin', 'Breitling', 'Panerai', 'TAG Heuer', 'Tudor']}
        stepsHeading="Jak wygląda wycena"
        steps={[
          { title: 'Zdjęcia', description: 'Wyślij zdjęcia i opis WhatsAppem lub formularzem.' },
          { title: 'Wycena wstępna', description: '15 minut na orientacyjną wartość rynkową.' },
          { title: 'Oględziny (opcjonalnie)', description: 'Spotkanie w butiku — wycena ostateczna.' },
          { title: 'Decyzja', description: 'Sprzedaż w skupie, komis lub po prostu informacja — bez zobowiązań.' },
        ]}
        faq={[
          { q: 'Czy wycena jest bezpłatna?', a: 'Tak. Zarówno wycena po zdjęciach, jak i wycena w butiku są bezpłatne i nie zobowiązują do sprzedaży.' },
          { q: 'Czym różni się wycena wstępna od ostatecznej?', a: 'Wycena wstępna to orientacyjny przedział na podstawie zdjęć. Ostateczną kwotę ustalamy po fizycznych oględzinach.' },
          { q: 'Czy mogę dostać wycenę pisemną?', a: 'Tak — na życzenie wystawiamy krótki dokument z opisem zegarka i przedziałem cenowym.' },
        ]}
        closingHeading="Sprawdź wartość swojego zegarka"
        closingText="Bezpłatnie, w 15 minut, bez zobowiązań."
        relatedLinks={[
          { href: '/skup-zegarkow-warszawa', label: 'Skup zegarków' },
          { href: '/komis-zegarkow-warszawa', label: 'Komis zegarków' },
          { href: '/skup-rolex-warszawa', label: 'Skup Rolex' },
        ]}
      />
    </>
  )
}
