import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'

const SLUG = 'skup-zegarkow-centrum-warszawy'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Skup zegarków centrum Warszawy — Mokotowska 71'
const DESCRIPTION =
  'Skup zegarków w centrum Warszawy. Butik przy ulicy Mokotowskiej 71 — Śródmieście, 5 minut od Placu Zbawiciela. Wycena tego samego dnia, gotówka.'

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Skup zegarków w centrum Warszawy', serviceType: 'Skup zegarków', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Skup zegarków centrum Warszawy')) }} />
      <SeoLanding
        eyebrow="Centrum Warszawy · Mokotowska"
        h1="Skup zegarków w centrum Warszawy"
        intro="Butik Warszawski Czas mieści się przy ulicy Mokotowskiej 71 — w samym sercu Śródmieścia, 5 minut spacerem od Placu Zbawiciela i 10 minut od Marszałkowskiej. Wycena i transakcja jeszcze tego samego dnia."
        primaryCtaLabel="Umów wizytę"
        source="landing-centrum-warszawy"
        highlights={[
          { title: 'Mokotowska 71', description: 'Adres butikowy w Śródmieściu — łatwy dojazd taksówką, metrem (Politechnika), tramwajem.' },
          { title: 'Wizyta tego samego dnia', description: 'Po wstępnej wycenie umawiamy spotkanie nawet w ciągu 2 godzin, w godzinach 11:00–18:00.' },
          { title: 'Bezpieczna transakcja', description: 'Prywatna część butiku, dyskrecja, gotówka albo przelew bankowy potwierdzony na miejscu.' },
        ]}
        bulletsHeading="Czemu klienci wybierają centrum"
        bullets={[
          'Lokalizacja w prestiżowej części Śródmieścia',
          'Bliskość biznesowych dzielnic — szybka wizyta w przerwie',
          'Łatwy dojazd komunikacją i samochodem (parking w okolicy)',
          'Spotkanie w eleganckiej, dyskretnej przestrzeni butiku',
        ]}
        stepsHeading="Twoja wizyta krok po kroku"
        steps={[
          { title: 'Kontakt', description: 'WhatsApp, telefon lub formularz — przesyłasz zdjęcia i ref.' },
          { title: 'Termin', description: 'Umawiamy spotkanie tego samego dnia (godz. 11:00–18:00).' },
          { title: 'Oględziny', description: 'Weryfikacja zegarka i ostateczna oferta w butiku.' },
          { title: 'Płatność', description: 'Gotówka albo przelew — od razu na miejscu.' },
        ]}
        faq={[
          { q: 'Gdzie znajduje się butik?', a: 'Mokotowska 71, 00-530 Warszawa, parter. Najbliższe metro: Politechnika.' },
          { q: 'W jakich godzinach jesteście otwarci?', a: 'Poniedziałek–piątek 11:00–18:00, sobota 11:00–15:00.' },
          { q: 'Czy konieczne jest umawianie wizyty?', a: 'Nie jest konieczne, ale rekomendujemy — dzięki temu zegarmistrz jest dostępny od razu.' },
        ]}
        closingHeading="Zapraszamy do butiku"
        closingText="Mokotowska 71, Warszawa — pn–pt 11–18, sb 11–15."
        relatedLinks={[
          { href: '/skup-zegarkow-warszawa', label: 'Skup zegarków Warszawa' },
          { href: '/butik', label: 'Butik Mokotowska 71' },
          { href: '/kontakt', label: 'Kontakt' },
        ]}
      />
    </>
  )
}
