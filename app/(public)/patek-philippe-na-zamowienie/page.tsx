import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'patek-philippe-na-zamowienie'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Patek Philippe na zamówienie — Nautilus, Aquanaut, Calatrava'
const DESCRIPTION =
  'Patek Philippe na zamówienie. Sprowadzimy konkretną referencję — Nautilus 5711/5712, Aquanaut 5167/5168, Calatrava, Complications. Dyskretny sourcing, weryfikacja pochodzenia.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Patek Philippe na zamówienie', serviceType: 'Sprowadzanie zegarków Patek Philippe', description: DESCRIPTION, url: URL, areaServed: 'Polska' })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Patek Philippe na zamówienie')) }} />
      <SeoLanding
        eyebrow="Patek Philippe · Na zamówienie"
        h1="Patek Philippe na zamówienie"
        intro="Patek Philippe to zegarki, których nie kupuje się przy ladzie — nawet w autoryzowanym salonie. Sprowadzamy konkretne referencje dyskretnie, z pełną weryfikacją pochodzenia, dla wąskiego grona klientów oczekujących najwyższego poziomu obsługi."
        primaryCtaLabel="Zleć dyskretne poszukiwanie"
        source="landing-patek-na-zamowienie"
        highlights={[
          { title: 'Dyskretne poszukiwanie', description: 'Pracujemy w obrębie zaufanej sieci kolekcjonerów i dilerów — bez publicznych ogłoszeń.' },
          { title: 'Weryfikacja pochodzenia', description: 'Pełna kontrola dokumentów, mechanizmu, oznaczeń i historii serwisu w manufakturze Patek Philippe.' },
          { title: 'Modele kolekcjonerskie', description: 'Także vintage i edycje rzadkie — Nautilus, Aquanaut, Grand Complications, Perpetual Calendar.' },
        ]}
        bulletsHeading="Najczęściej obsługiwane linie"
        bullets={[
          'Nautilus 5711/1A, 5712/1A, 5990/1A, 5980/1R',
          'Aquanaut 5167A, 5167R, 5168G, 5269/200R',
          'Calatrava 5196, 5226G, 5227, 6119',
          'Complications — Annual Calendar, World Time, Travel Time',
          'Grand Complications — Perpetual Calendar, Minute Repeater',
          'Vintage Patek — Calatrava, Nautilus 3700, Ellipse',
        ]}
        stepsHeading="Proces sourcingu"
        steps={[
          { title: 'Brief', description: 'Spotkanie lub rozmowa — definiujemy referencję, rok, stan, komplet, budżet.' },
          { title: 'Poszukiwanie', description: 'Dyskretne sondowanie sieci kolekcjonerów i partnerów europejskich.' },
          { title: 'Weryfikacja', description: 'Sprawdzenie autentyczności i historii w manufakturze.' },
          { title: 'Finalizacja', description: 'Prezentacja w butiku, akceptacja, transakcja w bezpiecznych warunkach.' },
        ]}
        closingHeading="Porozmawiajmy o konkretnym modelu"
        closingText="Nautilus, Aquanaut, Calatrava, Complications — wszystko w pełnej dyskrecji."
        relatedLinks={[
          { href: '/zegarki-na-zamowienie', label: 'Zegarki na zamówienie' },
          { href: '/zegarki-kolekcjonerskie', label: 'Zegarki kolekcjonerskie' },
          { href: '/audemars-piguet-na-zamowienie', label: 'AP na zamówienie' },
        ]}
      />
    </>
  )
}
