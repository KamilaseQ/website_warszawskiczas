import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'zegarki-kolekcjonerskie'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Zegarki kolekcjonerskie — vintage, edycje limitowane, inwestycyjne'
const DESCRIPTION =
  'Zegarki kolekcjonerskie i inwestycyjne — vintage Rolex, Omega Speedmaster, Patek Philippe, Audemars Piguet. Konsultacja kolekcjonerska, weryfikacja pochodzenia.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki kolekcjonerskie', serviceType: 'Konsultacja kolekcjonerska zegarków', description: DESCRIPTION, url: URL, areaServed: 'Polska' })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki kolekcjonerskie')) }} />
      <SeoLanding
        eyebrow="Kolekcjonerskie · Inwestycyjne"
        h1="Zegarki kolekcjonerskie i inwestycyjne"
        intro="Vintage Rolex, Omega Speedmaster Pre-Moon, Patek Philippe Calatrava, Audemars Piguet Royal Oak Jumbo. Doradzamy w budowaniu kolekcji i sourcujemy egzemplarze z udokumentowanym pochodzeniem oraz historią serwisową."
        primaryCtaLabel="Konsultacja kolekcjonerska"
        source="landing-zegarki-kolekcjonerskie"
        highlights={[
          { title: 'Vintage z historią', description: 'Egzemplarze z lat 50.–80. z udokumentowaną historią serwisową i papierami.' },
          { title: 'Edycje limitowane', description: 'Modele wycofane, wyprodukowane w niskich nakładach, anniversary edycje.' },
          { title: 'Inwestycja', description: 'Doradztwo przy budowaniu portfela: która marka, model, referencja, stan, dokumenty.' },
        ]}
        bulletsHeading="Modele najczęściej w obrocie kolekcjonerskim"
        bullets={[
          'Rolex vintage — Submariner 5512/5513, Daytona 6263/6265, Datejust 1601/1603',
          'Omega Speedmaster — Pre-Moon (105.012, 145.012), CK2998, Snoopy',
          'Patek Philippe — Nautilus 3700, Calatrava 96, Ellipse 3589',
          'Audemars Piguet — Royal Oak Jumbo 5402, 14790, 15202',
          'Modele anniversary i edycje limitowane wybranych marek',
        ]}
        stepsHeading="Współpraca z kolekcjonerem"
        steps={[
          { title: 'Konsultacja', description: 'Rozmowa o celu — kolekcja, inwestycja, jeden konkretny zegarek.' },
          { title: 'Selekcja', description: 'Definiujemy modele i konkretne referencje warte uwagi.' },
          { title: 'Sourcing', description: 'Poszukiwanie egzemplarzy z udokumentowaną historią.' },
          { title: 'Weryfikacja', description: 'Autentyczność, zgodność części, ekspertyzy zewnętrzne.' },
        ]}
        closingHeading="Porozmawiajmy o Twojej kolekcji"
        relatedLinks={[
          { href: '/zegarki-na-zamowienie', label: 'Zegarki na zamówienie' },
          { href: '/patek-philippe-na-zamowienie', label: 'Patek Philippe na zamówienie' },
          { href: '/audemars-piguet-na-zamowienie', label: 'AP na zamówienie' },
          { href: '/rolex-na-zamowienie', label: 'Rolex na zamówienie' },
        ]}
      />
    </>
  )
}
