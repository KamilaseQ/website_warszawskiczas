import type { Metadata } from 'next'
import { localizedAlternates } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, Heading, Text, Button, FaqAccordion, type FaqItem } from '@/components/ui'
import { RelatedGrid } from '@/components/products'
import { ProductGallery } from '@/components/products/product-gallery'
import { faqJsonLd } from '@/components/seo/seo-landing'
import { mockProducts, productUrlSlug, findProductByUrlSlug } from '@/data/mock-products'
import { CONTACT_PHONE, CONTACT_PHONE_RAW } from '@/lib/config'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: productUrlSlug(p) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = findProductByUrlSlug(slug) ?? mockProducts.find((p) => p.slug === slug)
  if (!product) return { title: 'Produkt nie znaleziony', robots: { index: false, follow: true } }

  const canonicalSlug = productUrlSlug(product)
  const url = `https://warszawskiczas.pl/produkty/${canonicalSlug}`
  const title = `${product.brand} ${product.name}${product.reference ? ` · ref. ${product.reference}` : ''} — Warszawa`
  const description = product.description
  const image = product.images?.[0]
    ? `https://warszawskiczas.pl${product.images[0]}`
    : 'https://warszawskiczas.pl/opengraph-image.jpg'

  return {
    title,
    description,
    alternates: localizedAlternates(`/produkty/${canonicalSlug}`, 'pl'),
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'Warszawski Czas',
      locale: 'pl_PL',
      images: [{ url: image, alt: `${product.brand} ${product.name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

const certificationFaq: FaqItem[] = [
  {
    q: 'Co zawiera certyfikat autentyczności?',
    a: 'Pełny opis egzemplarza, numer referencyjny, rok produkcji, opis stanu mechanizmu i koperty, datę i podpis zegarmistrza odpowiedzialnego za weryfikację. Dokument trafia do nabywcy w wersji papierowej oraz cyfrowej.',
  },
  {
    q: 'Jak weryfikujecie autentyczność?',
    a: 'Każdy zegarek przechodzi wieloetapową kontrolę: weryfikacja oznaczeń mechanizmu, pomiary chronometryczne, ocena pochodzenia (papiery, pudełko, historia serwisowa) oraz porównanie z bazą referencji.',
  },
  {
    q: 'Czy oferujecie gwarancję?',
    a: 'Tak — 12 miesięcy gwarancji butiku na pracę mechanizmu. Niezależnie od pozostałej gwarancji producenta, jeśli istnieje.',
  },
]

function formatPrice(value?: number, onRequest?: boolean) {
  if (value) {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(value)
  }
  if (onRequest) return 'Cena na zapytanie'
  return null
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = findProductByUrlSlug(slug) ?? mockProducts.find((p) => p.slug === slug)
  if (!product) notFound()

  const price = formatPrice(product.price, product.priceOnRequest)

  const tokens = (s?: string) =>
    new Set(
      (s ?? '')
        .toLowerCase()
        .split(/[^a-ząćęłńóśźż0-9]+/i)
        .filter((t) => t.length > 3)
    )
  const current = product
  const productMaterial = tokens(current.material)
  const productPrice = current.price ?? 0

  function similarity(p: (typeof mockProducts)[number]) {
    let score = 0
    if (p.brand === current.brand) score += 4
    const otherMat = tokens(p.material)
    let matMatches = 0
    productMaterial.forEach((t) => {
      if (otherMat.has(t)) matMatches += 1
    })
    score += Math.min(matMatches, 3)
    if (productPrice && p.price) {
      const diff = Math.abs(p.price - productPrice)
      const ratio = diff / Math.max(productPrice, p.price)
      if (ratio < 0.15) score += 3
      else if (ratio < 0.3) score += 2
      else if (ratio < 0.5) score += 1
    } else if (current.priceOnRequest && p.priceOnRequest) {
      score += 1
    }
    if (p.isExclusive && current.isExclusive) score += 1
    return score
  }

  const related = mockProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .map((p) => ({ p, s: similarity(p) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.p)

  const productLabel = `${product.brand} ${product.name}`

  const statusTone =
    product.status === 'Niedostępny'
      ? 'text-muted-foreground/70 line-through'
      : product.status === 'Zarezerwowany'
        ? 'text-muted-foreground'
        : 'text-accent-gold'

  const canonicalSlug = productUrlSlug(product)
  const productUrl = `https://warszawskiczas.pl/produkty/${canonicalSlug}`
  const productImages = (product.images ?? []).map((src) => `https://warszawskiczas.pl${src}`)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    brand: { '@type': 'Brand', name: product.brand },
    model: product.name,
    category: 'Zegarki luksusowe',
    description: product.description,
    sku: product.reference,
    mpn: product.reference,
    image: productImages.length ? productImages : undefined,
    url: productUrl,
    material: product.material,
    productionDate: product.year ? String(product.year).replace(/^#/, '') : undefined,
    itemCondition:
      product.condition && /nowy/i.test(product.condition)
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'PLN',
      price: product.price ?? undefined,
      ...(product.priceOnRequest && !product.price ? { priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'PLN', price: 0, valueAddedTaxIncluded: true } } : {}),
      availability:
        product.status === 'Niedostępny'
          ? 'https://schema.org/SoldOut'
          : product.status === 'Zarezerwowany'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/InStock',
      itemCondition:
        product.condition && /nowy/i.test(product.condition)
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/UsedCondition',
      seller: { '@type': 'Organization', name: 'Warszawski Czas', url: 'https://warszawskiczas.pl' },
      areaServed: { '@type': 'Country', name: 'PL' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://warszawskiczas.pl' },
      { '@type': 'ListItem', position: 2, name: 'Zegarki', item: 'https://warszawskiczas.pl/produkty' },
      { '@type': 'ListItem', position: 3, name: `${product.brand} ${product.name}`, item: productUrl },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(certificationFaq)) }}
      />

      {/* Breadcrumb / nav back */}
      <Section spacing="sm" className="pt-28 lg:pt-32">
        <Container>
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground hover:text-accent-gold transition-colors"
          >
            <span aria-hidden>←</span> Wróć do katalogu
          </Link>
        </Container>
      </Section>

      {/* Editorial layout: gallery + details */}
      <Section spacing="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery brand={product.brand} name={product.name} images={product.images} />
            </div>

            {/* Details */}
            <div className="lg:col-span-5 lg:py-4 flex flex-col">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                {product.brand}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl">
                {product.name}
              </h1>

              {product.reference && (
                <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Ref. {product.reference}
                  {product.year ? ` · ${product.year}` : ''}
                </p>
              )}

              {/* Status */}
              {product.status && (
                <div className="mt-6 inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" />
                  <span className={`font-sans text-[10px] font-bold uppercase tracking-[0.35em] ${statusTone}`}>
                    {product.status}
                  </span>
                </div>
              )}

              {/* Separator */}
              <div className="my-8 h-px w-12 bg-accent-gold" />

              <Text className="text-base leading-relaxed text-foreground/85">
                {product.description}
              </Text>

              {product.editorial && (
                <p className="mt-6 font-serif italic text-base leading-relaxed text-muted-foreground">
                  &ldquo;{product.editorial}&rdquo;
                </p>
              )}

              {/* Spec list */}
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-6">
                {product.year && (
                  <div>
                    <dt className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">
                      Rok
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-foreground">{product.year}</dd>
                  </div>
                )}
                {product.condition && (
                  <div>
                    <dt className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">
                      Stan
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-foreground">{product.condition}</dd>
                  </div>
                )}
                {product.material && (
                  <div>
                    <dt className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">
                      Materiał
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-foreground">{product.material}</dd>
                  </div>
                )}
                {product.reference && (
                  <div>
                    <dt className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">
                      Referencja
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-foreground">{product.reference}</dd>
                  </div>
                )}
                {product.caseSize && (
                  <div>
                    <dt className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">
                      Rozmiar
                    </dt>
                    <dd className="mt-1 font-serif text-lg text-foreground">{product.caseSize}</dd>
                  </div>
                )}
              </dl>

              {/* Price + CTA */}
              <div className="mt-8">
                {price && (
                  <p className="font-serif text-3xl font-medium text-foreground">
                    {price}
                  </p>
                )}
                <div className="mt-6 flex flex-col gap-3">
                  <Button asChild className="w-full" size="lg">
                    <ContactLink source="product-detail" product={productLabel}>Zapytaj o dostępność</ContactLink>
                  </Button>
                  <a
                    href={`tel:${CONTACT_PHONE_RAW}`}
                    className="inline-flex items-center justify-center gap-2 border border-border px-8 py-3 font-serif text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    Zadzwoń · {CONTACT_PHONE}
                  </a>
                </div>
                <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
                  Bezpłatna wycena · Dyskretna konsultacja
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Historia referencji */}
      {product.story && (
        <Section variant="muted" spacing="lg">
          <Container size="narrow">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                  Historia
                </p>
                <Heading as="h2" size="md" className="mt-4">
                  {product.brand} {product.name}
                </Heading>
              </div>
              <div className="lg:col-span-8">
                <Text className="text-lg leading-relaxed text-foreground/85">
                  {product.story}
                </Text>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Certyfikacja */}
      <Section spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
              Certyfikacja
            </p>
            <Heading as="h2" size="md" className="mt-4">
              Autentyczność potwierdzona
            </Heading>
            <Text muted className="mx-auto mt-4 max-w-xl">
              Każdy egzemplarz w naszym butiku przechodzi wieloetapową weryfikację
              przed wpisaniem do katalogu. Klient otrzymuje pełną dokumentację.
            </Text>
          </div>

          <div className="mt-12">
            <FaqAccordion items={certificationFaq} />
          </div>
        </Container>
      </Section>

      {/* Podobne modele */}
      {related.length > 0 && (
        <Section variant="muted" spacing="lg">
          <Container>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                  Może Cię zainteresować
                </p>
                <Heading as="h2" size="md" className="mt-4">
                  Podobne modele
                </Heading>
              </div>
              <Link
                href="/produkty"
                className="hidden sm:inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-foreground hover:text-accent-gold transition-colors"
              >
                Cały katalog <span aria-hidden>→</span>
              </Link>
            </div>

            <RelatedGrid products={related} />
          </Container>
        </Section>
      )}

      {/* Final CTA */}
      <Section spacing="lg">
        <Container size="narrow" className="text-center">
          <Heading as="h2" size="md">
            Chcesz zobaczyć ten egzemplarz na żywo?
          </Heading>
          <Text muted className="mx-auto mt-4 max-w-xl">
            Zapraszamy do butiku przy ulicy Mokotowskiej 71 lub na rozmowę online.
          </Text>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <ContactLink source="product-detail" product={productLabel}>Umów konsultację</ContactLink>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/butik">Odwiedź butik</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
