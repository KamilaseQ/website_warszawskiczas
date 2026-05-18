import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd, itemListJsonLd } from '@/components/seo/seo-landing'
import { productsByBrand } from '@/lib/seo-product-filters'
import { getAllProducts } from '@/from-cms/adapters/products'
import { relatedLinksFor } from '@/lib/related-links'

const SLUG = 'zegarki-breitling-warszawa'
const URL = `https://warszawskiczas.pl/${SLUG}`
const TITLE = 'Breitling Warszawa — używane zegarki Navitimer, Superocean, Chronomat, Premier'
const DESCRIPTION =
  'Breitling w Warszawie — Navitimer, Superocean, Chronomat, Premier, Avenger, Top Time. Sprzedaż używanych zegarków Breitling, sprowadzanie konkretnych referencji oraz skup. Pełna weryfikacja autentyczności i wsparcie posprzedażowe. Mokotowska 71.'

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
    images: [{ url: 'https://warszawskiczas.pl/opengraph-image.jpg', alt: 'Breitling — Warszawski Czas, Mokotowska 71' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['https://warszawskiczas.pl/opengraph-image.jpg'] },
}

export default async function Page() {
  const all = await getAllProducts()
  const products = productsByBrand(all, 'Breitling', 6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: 'Zegarki Breitling w Warszawie', serviceType: 'Sprzedaż zegarków Breitling', description: DESCRIPTION, url: URL })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(SLUG, 'Zegarki Breitling Warszawa')) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd({ name: 'Zegarki Breitling — Warszawski Czas', url: URL, products })) }} />

      <SeoLanding
        eyebrow="Breitling · Warszawa"
        h1="Zegarki Breitling w Warszawie — Navitimer, Superocean, Chronomat, Premier"
        intro="Breitling Navitimer B01 Chronograph 43, Superocean Heritage B20, Chronomat B01 42, Premier B01 Chronograph, Avenger Chronograph 45, Top Time Classic Cars, Chronoliner — szeroki wybór używanych zegarków Breitling w Warszawie. Pilotażowe chronografy, nurkowe Superocean, sportowe Chronomat oraz klasyczne Premier — z pełną weryfikacją autentyczności i wsparciem posprzedażowym."
        primaryCtaLabel="Zapytaj o model Breitling"
        source="landing-zegarki-breitling"
        body={[
          {
            heading: 'Breitling w Warszawie — chronografy lotnicze, zegarki nurkowe, sportowa elegancja',
            paragraphs: [
              'Breitling to marka z najdłuższą udokumentowaną historią chronografów lotniczych — od 1884 roku. Współczesna oferta Breitlinga łączy klasyczne ikony pilotażowe (Navitimer z circular slide rule, Premier, Top Time) z linią nurkową (Superocean, SuperOcean Heritage) i sportowymi modelami Chronomat. Wszystkie noszą certyfikację COSC chronometru i bazują na manufakturowych kalibrach B01, B20, B25, B35 — niezależnych od ETA.',
              'Warszawski Czas oferuje pełen przekrój używanych zegarków Breitling w butiku przy Mokotowskiej 71. Część egzemplarzy znajduje się w stałej ekspozycji, kolejne sprowadzamy na zamówienie — typowo w 7–30 dni — z sieci dilerów w Szwajcarii, Włoszech, Niemczech i Wielkiej Brytanii oraz od prywatnych właścicieli z Europy Środkowej.',
              'Każdy Breitling przechodzi pełną weryfikację autentyczności i stanu: kontrolę mechanizmu, pomiary chronometryczne, ocenę koperty i bransolety, weryfikację dokumentów oraz historię serwisową. Klient otrzymuje pełen opis stanu egzemplarza, przebieg weryfikacji oraz wsparcie posprzedażowe.',
            ],
          },
          {
            heading: 'Najczęściej obsługiwane kolekcje Breitling',
            paragraphs: [
              'Breitling Navitimer — najsłynniejszy chronograf pilotażowy świata, w obrocie ciągłym od 1952 roku. Najczęściej spotykane wersje to Navitimer B01 Chronograph 43 (AB0138, AB0139), Navitimer B01 46 (AB0137), Navitimer Heritage Edition oraz Navitimer Cosmonaute. Charakterystyczny circular slide rule do obliczeń lotniczych zostaje rozpoznawalnym elementem niezależnie od konfiguracji.',
              'Breitling Superocean i Superocean Heritage — linia nurkowa o korzeniach z 1957 roku. Superocean Heritage B20 Automatic 42 (AB2010) i 44, Superocean Automatic 42/44/46 (A17376, A17367), Superocean Heritage II Chronograph oraz limitowane edycje Outerknown. Wersje z niebieską ceramiką, bransoletą mesh i pomarańczową wskazówką sekundową są szczególnie poszukiwane.',
              'Breitling Chronomat B01 42 — sportowy chronograf z charakterystyczną bransoletą Rouleaux. Najczęściej spotykane to Chronomat B01 42 z czarną, niebieską, srebrną, zieloną i mietową tarczą (AB0134), Chronomat Automatic GMT 40 oraz Chronomat 32 i 36 w wersjach damskich z diamentowymi indeksami.',
              'Breitling Premier B01 Chronograph 42 — klasyczna, elegancka linia inspirowana modelami Breitling Premier z lat 40. Najczęściej spotykane: Premier B01 Chronograph 42 (AB0118), Premier B25 Datora 42, Premier Heritage Chronograph oraz limitowane Premier Bentley Mulliner.',
              'Breitling Top Time Classic Cars — kolaboracje z Shelby Cobra, Ford Mustang, Triumph i Chevrolet Corvette. Top Time B01 Classic Cars Capsule Collection — chronograf 41 mm w stylu lat 60. — to ulubiona linia kolekcjonerów retro.',
              'Breitling Avenger Chronograph 45, Avenger B01 Chronograph 44, Avenger Automatic 42 — sportowe, masywne zegarki z wzmocnioną konstrukcją koperty, dostępne w stali, tytanowej szarości i z bransoletami Diver Pro.',
            ],
          },
          {
            heading: 'Kalibry manufakturowe B01, B20, B25 — co to znaczy w praktyce',
            paragraphs: [
              'Breitling produkuje manufakturowe kalibry chronografów od 2009 roku (Breitling Calibre 01, "B01"). Kalibr B01 — używany w Navitimerze, Chronomacie i Premier — to integralny chronograf kolumnowy z 70-godzinną rezerwą chodu, certyfikowany COSC. Kalibr B20 (Superocean Heritage) to wspólny projekt z Tudorem, też 70 godzin rezerwy, automatyczny.',
              'Na rynku wtórnym wartość Breitlinga rośnie wraz z kalibrem manufakturowym i kompletnością dokumentacji. Egzemplarze pre-2009 z kalibrami ETA/Valjoux (np. starszy Navitimer z Valjoux 7750) są często niżej wyceniane, choć kolekcjonersko ciekawe. Modele po 2017 roku — okres po nabyciu marki przez CVC Capital Partners — mają nową estetykę i nowe bransolety, co dla części klientów jest zaletą, dla części wadą.',
            ],
          },
        ]}
        highlights={[
          { title: 'Sprowadzanie konkretnej referencji Breitling', description: 'Navitimer B01, Superocean B20, Chronomat B01, Premier B01 i inne — typowo 7–30 dni.' },
          { title: 'Pełna weryfikacja autentyczności', description: 'Mechanizm B01/B20/B25, pomiary chronometryczne, dokumenty, historia serwisowa — pełna dokumentacja każdego egzemplarza.' },
          { title: 'Pełne wsparcie posprzedażowe', description: 'Bezterminowe wsparcie techniczne po zakupie — pytania techniczne, regulacje, wycena pod ubezpieczenie, doradztwo przy serwisie.' },
        ]}
        bulletsHeading="Breitling — modele najczęściej w obrocie"
        bullets={[
          'Navitimer B01 Chronograph 43 i 46 — AB0138, AB0139, AB0137 — czarna, niebieska, srebrna, panda',
          'Navitimer Heritage Edition, Navitimer Cosmonaute, Navitimer 1959 Re-Edition',
          'Superocean Heritage B20 Automatic 42/44 — AB2010, niebieska, czarna, zielona ceramika',
          'Superocean Automatic 42/44/46 (A17376, A17367) — sportowa wersja nurkowa',
          'Chronomat B01 42 — AB0134 — czarna, niebieska, srebrna, zielona, miętowa, bransoleta Rouleaux',
          'Chronomat Automatic GMT 40 — z funkcją drugiej strefy czasowej',
          'Premier B01 Chronograph 42 — AB0118 — niebieska, biała, czarna, Bentley Mulliner',
          'Top Time B01 Classic Cars — Cobra, Mustang, Corvette, Triumph (limitowane)',
          'Avenger Chronograph 45, Avenger B01 Chronograph 44, Avenger Automatic 42',
          'Chronoliner B04 GMT (archiwalny), SuperOcean Heritage II Chronograph 44',
        ]}
        productPreview={{
          heading: 'Wybrane Breitlingi z aktualnej oferty',
          description: 'Egzemplarze dostępne od ręki w butiku przy Mokotowskiej 71. Pełną listę zegarków znajdziesz w katalogu.',
          products,
          href: '/produkty',
          hrefLabel: 'Cały katalog',
        }}
        stepsHeading="Jak sprowadzimy Twojego Breitlinga"
        steps={[
          { title: 'Brief', description: 'Podajesz model Breitling (referencja, kolor tarczy, materiał, rok, komplet papierów, budżet).' },
          { title: 'Wyszukiwanie', description: 'Sieć dilerów w Szwajcarii, Włoszech, Niemczech i Wielkiej Brytanii oraz rynek prywatny.' },
          { title: 'Oferta', description: 'Otrzymujesz 1–3 egzemplarze do wyboru ze zdjęciami, dokumentacją i ceną finalną.' },
          { title: 'Finalizacja', description: 'Zakup w butiku albo zdalnie z ubezpieczonym kurierem, z pełną dokumentacją egzemplarza i wsparciem posprzedażowym.' },
        ]}
        faq={[
          { q: 'Czy są jakieś Breitlingi dostępne od ręki w butiku?', a: 'Tak, znacząca część egzemplarzy znajduje się w stałej ekspozycji butiku przy Mokotowskiej 71. Aktualną listę dostępnych zegarków Breitling znajdziesz w katalogu, a egzemplarze można obejrzeć tego samego dnia po krótkim umówieniu wizyty.' },
          { q: 'Czy jesteście autoryzowanym dealerem Breitling?', a: 'Nie. Warszawski Czas działa na rynku wtórnym i nie jest autoryzowanym dilerem Breitlinga. Sprzedajemy używane zegarki Breitling od sprawdzonych dostawców europejskich i prywatnych właścicieli, z pełną weryfikacją autentyczności i wsparciem posprzedażowym po zakupie.' },
          { q: 'Ile trwa sprowadzenie konkretnej referencji Breitling?', a: 'Typowo 7–30 dni w zależności od dostępności modelu. Klasyczne Navitimery, Superocean Heritage i Chronomaty są typowo dostępne w 7–14 dni; rzadkie wersje (zielony Chronomat, edycje limitowane Top Time, archiwalne Chronoliner) mogą wymagać 30–60 dni.' },
          { q: 'Czym różni się stary Navitimer (Valjoux 7750) od nowego z kalibrem B01?', a: 'Stare Navitimery (przed 2009) wyposażone w Valjoux 7750 — modularny chronograf 28800 vph z 48-godzinną rezerwą — są kolekcjonersko ciekawe, ale technicznie ustępują manufakturowemu B01 (kolumnowy chronograf 28800 vph, 70-godzinna rezerwa, COSC). Wartość rynkowa nowszych egzemplarzy z B01 jest typowo wyższa, ale starsze Valjoux 7750 mają wartość historyczną i mniejsze koszty serwisu.' },
          { q: 'Czy oferujecie skup zegarków Breitling w Warszawie?', a: 'Tak. Prowadzimy skup zegarków Breitling — wstępna wycena każdej referencji w 15 minut po zdjęciach, finalizacja tego samego dnia gotówką lub przelewem po obejrzeniu egzemplarza w butiku.' },
          { q: 'Czy Breitling to dobra inwestycja?', a: 'Breitling nie jest typowym "wzrostowym" zegarkiem inwestycyjnym jak Rolex czy Patek — wartości rynkowe rosną wolno i bardziej zależą od konkretnego egzemplarza (referencja, kolor tarczy, kompletność dokumentów). Edycje limitowane (Top Time Classic Cars, Bentley Mulliner, kolaboracje z Outerknown) zyskują szybciej. Klasyczny Navitimer i Superocean Heritage to dobre zakupy z zachowaniem wartości w 5–10 letnim horyzoncie.' },
        ]}
        closingHeading="Zapytaj o swój model Breitling"
        closingText="Navitimer, Superocean, Chronomat, Premier — sprowadzimy konkretną referencję Breitling w 7–30 dni."
        relatedLinks={relatedLinksFor('zegarki-breitling-warszawa', 'brand-hub')}
      />
    </>
  )
}
