import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import Link from 'next/link'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, Heading, Text, Button } from '@/components/ui'
import { ProductCatalog } from '@/components/products'
import { mockProducts, productUrlSlug } from '@/data/mock-products'

export const metadata: Metadata = {
  title: 'Zegarki luksusowe w Warszawie — katalog Warszawski Czas',
  description:
    'Katalog zegarków luksusowych dostępnych w butiku przy Mokotowskiej 71. Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling — certyfikowane egzemplarze z gwarancją autentyczności.',
  alternates: localizedAlternates('/produkty', 'pl'),
  openGraph: {
    type: 'website',
    url: 'https://warszawskiczas.pl/produkty',
    title: 'Zegarki luksusowe w Warszawie — katalog Warszawski Czas',
    description:
      'Certyfikowane zegarki premium dostępne od ręki. Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier i więcej — Mokotowska 71.',
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
}

const collectionJsonLd = (() => {
  const watches = mockProducts.filter((p) => p.category === 'zegarki' && p.status !== 'Niedostępny')
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Zegarki luksusowe w Warszawie',
    description:
      'Katalog certyfikowanych zegarków premium dostępnych w butiku Warszawski Czas, Mokotowska 71.',
    url: 'https://warszawskiczas.pl/produkty',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: watches.length,
      itemListElement: watches.slice(0, 30).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://warszawskiczas.pl/produkty/${productUrlSlug(p)}`,
        name: `${p.brand} ${p.name}`,
      })),
    },
  }
})()

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://warszawskiczas.pl' },
    { '@type': 'ListItem', position: 2, name: 'Zegarki', item: 'https://warszawskiczas.pl/produkty' },
  ],
}

export default function ProduktyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Slim editorial banner — odstęp od headera, czytelny H1 */}
      <Section variant="muted" spacing="sm" className="border-b border-border pt-28 lg:pt-32">
        <Container>
          <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                Katalog · {mockProducts.filter((p) => p.category === 'zegarki').length} pozycji
              </p>
              <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.05]">
                Zegarki dostępne <span className="italic text-foreground/80">w butiku</span>
              </h1>
              <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base text-pretty">
                Każdy egzemplarz zweryfikowany pod kątem autentyczności i stanu.
              </p>
            </div>

            <div className="hidden lg:col-span-5 lg:block lg:border-l lg:border-border lg:pl-8">
              <p className="font-serif italic text-sm text-muted-foreground sm:text-base text-pretty">
                &ldquo;Najpiękniejsze zegarki nie są najgłośniejsze — są te, które dyskretnie towarzyszą nam przez dekady.&rdquo;
              </p>
              <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                — Warszawski Czas
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Catalog — bezpośrednio pod banerem, bez dużego oddechu */}
      <Section variant="muted" spacing="sm">
        <Container>
          <ProductCatalog products={mockProducts} />
        </Container>
      </Section>

      {/* CTA */}
      <Section spacing="lg">
        <Container size="narrow" className="text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
            Nie znalazłeś?
          </p>
          <Heading as="h2" size="md" className="mt-4">
            Część kolekcji nie jest publiczna
          </Heading>
          <Text muted className="mx-auto mt-4 max-w-xl">
            Zegarki z prywatnych kolekcji, modele &ldquo;na zapytanie&rdquo; i pozycje
            zarezerwowane dla stałych klientów — dostępne po krótkiej rozmowie.
          </Text>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/kolekcja-na-zapytanie">Kolekcja Prywatna</Link>
            </Button>
            <Button variant="outline" asChild>
              <ContactLink source="product-listing">Skontaktuj się</ContactLink>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
