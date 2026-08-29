import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, Heading, Text, Button } from '@/components/ui'
import { ProductCatalog } from '@/components/products'
import { SeoLinkHub } from '@/components/seo/seo-link-hub'
import { seoHubLinks } from '@/lib/related-links'
import { toCatalogProduct } from '@/lib/catalog-product'
import { getAllProducts, productUrlSlug } from '@/from-cms/adapters/products'

export const metadata: Metadata = {
  title: 'Zegarki, biżuteria i akcesoria luksusowe — katalog Warszawski Czas',
  description:
    'Katalog luksusowych zegarków, biżuterii i akcesoriów w Warszawie. Wyselekcjonowane pozycje z weryfikacją autentyczności, materiałów i stanu.',
  alternates: localizedAlternates('/produkty', 'pl'),
  openGraph: {
    type: 'website',
    url: 'https://warszawskiczas.pl/produkty',
    title: 'Zegarki, biżuteria i akcesoria luksusowe — katalog Warszawski Czas',
    description:
      'Wyselekcjonowane zegarki, biżuteria i akcesoria luksusowe dostępne w Warszawskim Czasie przy Mokotowskiej 71.',
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://warszawskiczas.pl' },
    { '@type': 'ListItem', position: 2, name: 'Katalog', item: 'https://warszawskiczas.pl/produkty' },
  ],
}

export default async function ProduktyPage() {
  const products = await getAllProducts()
  // Decyzja: katalog pokazuje trzy jawne statusy: Dostępny, Na zamówienie, Niedostępny.
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Zegarki, biżuteria i akcesoria luksusowe w Warszawie',
    description:
      'Katalog wyselekcjonowanych zegarków, biżuterii i akcesoriów luksusowych dostępnych w Warszawskim Czasie przy Mokotowskiej 71.',
    url: 'https://warszawskiczas.pl/produkty',
    inLanguage: 'pl-PL',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://warszawskiczas.pl/produkty/${productUrlSlug(p)}`,
        name: `${p.brand} ${p.name}`,
      })),
    },
  }
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
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold-dark">
                Katalog · {products.length} pozycji
              </p>
              <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.05]">
                Zegarki, biżuteria i akcesoria{' '}
                <span className="italic text-foreground/80">w butiku</span>
              </h1>
              <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base text-pretty">
                Każda pozycja jest weryfikowana pod kątem autentyczności, materiałów i stanu.
              </p>
            </div>

            <div className="hidden lg:col-span-5 lg:block lg:border-l lg:border-border lg:pl-8">
              <p className="font-serif italic text-sm text-muted-foreground sm:text-base text-pretty">
                &ldquo;Najcenniejsze przedmioty nie muszą być najgłośniejsze — dyskretnie
                towarzyszą nam przez dekady.&rdquo;
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
          <ProductCatalog products={products.map(toCatalogProduct)} />
        </Container>
      </Section>

      {/* Hub linków wewnętrznych — marki / kategorie / usługi (SEO + nawigacja) */}
      <Section spacing="lg">
        <Container>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold-dark">
            Przeglądaj katalog
          </p>
          <Heading as="h2" size="md" className="mt-3">
            Kolekcja według marki i kategorii
          </Heading>
          <Text muted className="mt-3 max-w-2xl">
            Wybierz markę lub kategorię, aby zobaczyć zegarki, biżuterię i akcesoria
            dostępne od ręki lub na zamówienie w butiku przy Mokotowskiej 71.
          </Text>
          <div className="mt-10">
            <SeoLinkHub groups={seoHubLinks('pl')} />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section spacing="lg">
        <Container size="narrow" className="text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold-dark">
            Nie znalazłeś?
          </p>
          <Heading as="h2" size="md" className="mt-4">
            Część kolekcji nie jest publiczna
          </Heading>
          <Text muted className="mx-auto mt-4 max-w-xl">
            Zegarki, biżuteria i akcesoria z prywatnych kolekcji oraz pozycje
            zarezerwowane dla stałych klientów są dostępne po krótkiej rozmowie.
          </Text>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <ContactLink source="product-listing">Zapytaj o dostępność</ContactLink>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
