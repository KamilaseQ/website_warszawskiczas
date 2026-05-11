import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'zegarki-na-zamowienie'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki na zamówienie — sprowadzanie konkretnych referencji'
const DESCRIPTION =
  'Zegarki na zamówienie — sprowadzimy konkretną referencję Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier. Polska, dyskretnie, z weryfikacją pochodzenia.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Sprowadzanie zegarków premium na zamówienie', serviceType: 'Zegarki na zamówienie', description: DESCRIPTION, url: URL, areaServed: 'Polska' })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki na zamówienie')) }} />
      <SeoLanding
        eyebrow="Na zamówienie · Polska"
        h1="Zegarki na zamówienie — sprowadzimy konkretną referencję"
        intro="Szukasz konkretnego modelu, którego nie ma w katalogu? Specjalizujemy się w sourcingu zegarków premium na zamówienie dla klientów z Warszawy i całej Polski. Krótki brief — i otrzymujesz egzemplarze do wyboru z udokumentowanym pochodzeniem."
        primaryCtaLabel="Zleć poszukiwanie zegarka"
        source="landing-zegarki-na-zamowienie"
        highlights={[
          { title: 'Konkretna referencja', description: 'Mówisz, czego szukasz — my znajdujemy. Marka, model, ref., tarcza, rok, budżet.' },
          { title: 'Weryfikacja pochodzenia', description: 'Każdy proponowany egzemplarz po weryfikacji autentyczności i historii serwisu.' },
          { title: 'Bez ryzyka', description: 'Akceptujesz konkretny zegarek po wycenie i zdjęciach — nie kupujesz „w ciemno”.' },
        ]}
        bulletsHeading="Co najczęściej sprowadzamy"
        bullets={[
          'Rolex — Daytona, Submariner, GMT-Master, Datejust, Day-Date, Sky-Dweller, Yacht-Master',
          'Patek Philippe — Nautilus, Aquanaut, Calatrava, Complications',
          'Audemars Piguet — Royal Oak, Royal Oak Offshore, Code 11.59',
          'Omega — Speedmaster (vintage i nowe), Seamaster, Constellation',
          'Cartier — Tank, Santos, Panthère, Ballon Bleu',
          'Modele kolekcjonerskie i edycje limitowane na życzenie',
        ]}
        stepsHeading="Proces sourcingu"
        steps={[
          { title: 'Brief', description: 'Wypełniasz krótki formularz: marka, model, referencja, tarcza, rok, stan, budżet.' },
          { title: 'Poszukiwanie', description: 'Sprawdzamy bazę dostawców w Polsce i Europie.' },
          { title: 'Oferta', description: 'Przedstawiamy 1–3 egzemplarze ze zdjęciami, papierami i ceną.' },
          { title: 'Odbiór', description: 'Po weryfikacji i akceptacji — odbiór w butiku albo wysyłka kurierska z ubezpieczeniem.' },
        ]}
        faq={[
          { q: 'Ile trwa sprowadzenie zegarka?', a: 'Najczęściej 7–30 dni. Modele rzadkie i bardzo poszukiwane mogą wymagać dłuższego czasu.' },
          { q: 'Czy muszę zapłacić zaliczkę?', a: 'Przy popularnych referencjach — nie. Przy modelach rzadkich i kolekcjonerskich uzgadniamy zaliczkę indywidualnie.' },
          { q: 'Czy oferujecie gwarancję na sprowadzone zegarki?', a: 'Tak. Każdy egzemplarz otrzymuje certyfikat butiku i 12 miesięcy gwarancji na pracę mechanizmu.' },
          { q: 'Czy działacie tylko w Warszawie?', a: 'Nie — obsługujemy klientów z całej Polski. Wysyłka kurierska z pełnym ubezpieczeniem.' },
        ]}
        closingHeading="Powiedz, czego szukasz"
        closingText="Krótki brief — i otrzymujesz egzemplarze odpowiadające Twoim oczekiwaniom."
        relatedLinks={[
          { href: '/rolex-na-zamowienie', label: 'Rolex na zamówienie' },
          { href: '/patek-philippe-na-zamowienie', label: 'Patek Philippe na zamówienie' },
          { href: '/audemars-piguet-na-zamowienie', label: 'AP na zamówienie' },
          { href: '/zegarki-kolekcjonerskie', label: 'Zegarki kolekcjonerskie' },
        ]}
      />
    </>
  )
}
