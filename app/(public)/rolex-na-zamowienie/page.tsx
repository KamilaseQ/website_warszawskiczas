import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'rolex-na-zamowienie'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Rolex na zamówienie — Daytona, Submariner, GMT-Master, Datejust'
const DESCRIPTION =
  'Rolex na zamówienie — sprowadzimy konkretną referencję bez listy oczekujących u autoryzowanego dealera. Daytona, Submariner, GMT-Master, Datejust, Day-Date, Sky-Dweller.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Rolex na zamówienie', serviceType: 'Sprowadzanie zegarków Rolex', description: DESCRIPTION, url: URL, areaServed: 'Polska' })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Rolex na zamówienie')) }} />
      <SeoLanding
        eyebrow="Rolex · Na zamówienie"
        h1="Rolex na zamówienie — bez listy oczekujących"
        intro="Każdy Rolex jest dziś trudno dostępny w autoryzowanym salonie. My działamy na rynku wtórnym i sprowadzamy konkretne referencje w 7–30 dni. Powiedz, jakiego modelu szukasz — przedstawimy egzemplarze do wyboru."
        primaryCtaLabel="Znajdź mi Rolexa"
        source="landing-rolex-na-zamowienie"
        highlights={[
          { title: 'Daytona, Submariner, GMT-Master', description: 'Najczęściej poszukiwane referencje sportowe — zwykle 7–14 dni od briefu do oferty.' },
          { title: 'Datejust, Day-Date, Sky-Dweller', description: 'Linie eleganckie i klasyczne — dostępne częściej i szybciej.' },
          { title: 'Modele kolekcjonerskie', description: 'Vintage Rolex, edycje limitowane, modele wycofane — sourcing indywidualny.' },
        ]}
        bulletsHeading="Konkretne referencje, które sprowadzamy"
        bullets={[
          'Daytona — 116500LN, 126500LN, 116508, Le Mans, panda',
          'Submariner — 124060, 126610LV (Kermit), 126610LN, 126613LB',
          'GMT-Master II — 126710BLRO (Pepsi), 126710BLNR (Batman), 126711CHNR',
          'Datejust 36 / 41 — Wimbledon, Tapestry, Jubilee/Oyster',
          'Day-Date 36 / 40 — Olive Roman, Meteorite, President',
          'Sky-Dweller, Yacht-Master, Explorer, Sea-Dweller',
        ]}
        stepsHeading="Jak sprowadzimy Twojego Rolexa"
        steps={[
          { title: 'Brief', description: 'Referencja, tarcza, rok, stan, komplet papierów, budżet.' },
          { title: 'Poszukiwanie', description: 'Sieć dostawców w Polsce i Europie + rynek wtórny.' },
          { title: 'Oferta', description: '1–3 egzemplarze ze zdjęciami, papierami i ceną finalną.' },
          { title: 'Odbiór', description: 'Po akceptacji i weryfikacji — odbiór w butiku lub kurier.' },
        ]}
        faq={[
          { q: 'Czy jesteście autoryzowanym dealerem Rolex?', a: 'Nie. Działamy na rynku wtórnym i sprowadzamy egzemplarze od sprawdzonych dostawców i właścicieli prywatnych.' },
          { q: 'Ile trwa sprowadzenie Rolexa?', a: 'Najczęściej 7–30 dni. Konkretne, popularne referencje — szybciej. Rzadkie modele — dłużej.' },
          { q: 'Czy każdy Rolex będzie z papierami?', a: 'Wskazujesz wymagania w briefie — sprowadzamy tylko egzemplarze spełniające Twoje kryteria.' },
          { q: 'Czy oferujecie gwarancję?', a: 'Tak — 12 miesięcy gwarancji butiku na pracę mechanizmu i certyfikat autentyczności.' },
        ]}
        closingHeading="Powiedz, jakiego Rolexa szukasz"
        closingText="Daytona, Submariner, GMT-Master, Datejust — sprowadzimy konkretną referencję."
        relatedLinks={[
          { href: '/zegarki-rolex-warszawa', label: 'Zegarki Rolex Warszawa' },
          { href: '/skup-rolex-warszawa', label: 'Skup Rolex' },
          { href: '/zegarki-na-zamowienie', label: 'Zegarki na zamówienie' },
        ]}
      />
    </>
  )
}
