import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, MapPin, Phone, MessageCircle } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, Heading, Text, Button, FaqAccordion, type FaqItem } from '@/components/ui'
import { CONTACT_PHONE, CONTACT_PHONE_RAW, WHATSAPP_NUMBER, ADDRESS } from '@/lib/config'
import { absoluteUrl, localizePath, type Locale, ui } from '@/lib/i18n'
import { type Product, productUrlSlug } from '@/data/mock-products'

export interface LandingStep {
  title: string
  description: string
}

export interface LandingHighlight {
  title: string
  description: string
}

export interface LandingBodyBlock {
  heading: string
  paragraphs: string[]
}

export interface SeoLandingProps {
  locale?: Locale
  eyebrow: string
  h1: string
  intro: string
  primaryCtaLabel?: string
  source: string
  /** Optional decorative hero image (right side on desktop). */
  heroImage?: { src: string; alt: string }
  /** Optional editorial body — rendered between hero and highlights for keyword-rich SEO copy. */
  body?: LandingBodyBlock[]
  highlights: LandingHighlight[]
  bullets?: string[]
  bulletsHeading?: string
  steps?: LandingStep[]
  stepsHeading?: string
  brands?: string[]
  brandsHeading?: string
  /** Optional list of products to feature in a small grid (e.g. brand category preview). */
  productPreview?: {
    heading: string
    description?: string
    products: Product[]
    href?: string
    hrefLabel?: string
  }
  faq?: FaqItem[]
  closingHeading?: string
  closingText?: string
  relatedLinks?: { href: string; label: string }[]
}

export function SeoLanding({
  locale = 'pl',
  eyebrow,
  h1,
  intro,
  primaryCtaLabel = ui[locale].contactUs,
  source,
  heroImage,
  body,
  highlights,
  bullets,
  bulletsHeading,
  steps,
  stepsHeading = 'Jak to działa',
  brands,
  brandsHeading = 'Marki, którymi się zajmujemy',
  productPreview,
  faq,
  closingHeading = 'Porozmawiajmy',
  closingText,
  relatedLinks,
}: SeoLandingProps) {
  const t = ui[locale]
  const waMessage = encodeURIComponent(`${t.whatsappIntro}: ${h1}.`)

  return (
    <>
      {faq?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
        />
      ) : null}

      {/* Hero */}
      <Section spacing="md" className="pt-28 lg:pt-32">
        <Container>
          <div className={heroImage ? 'grid items-center gap-12 lg:grid-cols-12' : ''}>
            <div className={heroImage ? 'lg:col-span-7' : 'max-w-3xl'}>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                {eyebrow}
              </p>
              <Heading as="h1" size="xl" className="mt-4">
                {h1}
              </Heading>
              <Text variant="lead" muted className="mt-6">
                {intro}
              </Text>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild>
                  <ContactLink source={source}>{primaryCtaLabel}</ContactLink>
                </Button>
                <a
                  href={`tel:${CONTACT_PHONE_RAW}`}
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 font-serif text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold"
                >
                  <Phone className="h-4 w-4" /> {CONTACT_PHONE}
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 font-serif text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>

              <p className="mt-6 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent-gold" />
                {ADDRESS.street}, {ADDRESS.postal} {ADDRESS.city} · {t.weekdays}
              </p>
            </div>

            {heroImage ? (
              <div className="relative aspect-[4/5] overflow-hidden bg-muted lg:col-span-5">
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* Editorial body */}
      {body?.length ? (
        <Section spacing="lg">
          <Container size="narrow">
            <div className="space-y-12">
              {body.map((b, i) => (
                <div key={i}>
                  <Heading as="h2" size="md">
                    {b.heading}
                  </Heading>
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/85">
                    {b.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Highlights */}
      <Section variant="muted" spacing="lg">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h, i) => (
              <div key={i} className="border-l-2 border-accent-gold/40 pl-6">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-accent-gold">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-3 font-serif text-xl font-medium leading-tight">
                  {h.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Bullets / brands */}
      {(bullets?.length || brands?.length) && (
        <Section spacing="lg">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              {bullets?.length ? (
                <div>
                  <Heading as="h2" size="md">
                    {bulletsHeading ?? 'Co warto wiedzieć'}
                  </Heading>
                  <ul className="mt-8 space-y-4">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-gold" />
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {brands?.length ? (
                <div>
                  <Heading as="h2" size="md">
                    {brandsHeading}
                  </Heading>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {brands.map((b, i) => (
                      <span
                        key={i}
                        className="rounded border border-border px-4 py-2 text-sm text-muted-foreground"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Container>
        </Section>
      )}

      {/* Product preview */}
      {productPreview?.products?.length ? (
        <Section variant="muted" spacing="lg">
          <Container>
            <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                  {t.selectedPieces}
                </p>
                <Heading as="h2" size="md" className="mt-3">
                  {productPreview.heading}
                </Heading>
                {productPreview.description ? (
                  <Text muted className="mt-3 max-w-2xl">
                    {productPreview.description}
                  </Text>
                ) : null}
              </div>
              {productPreview.href ? (
                <Link
                  href={localizePath(productPreview.href, locale)}
                  className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-foreground hover:text-accent-gold transition-colors"
                >
                  {productPreview.hrefLabel ?? t.viewFullCatalog} <ArrowRight className="h-3 w-3" />
                </Link>
              ) : null}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productPreview.products.slice(0, 6).map((p) => {
                const slug = productUrlSlug(p)
                const img = p.images?.[0]
                return (
                  <Link
                    key={p.id}
                    href={localizePath(`/produkty/${slug}`, locale)}
                    className="group block bg-background"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      {img ? (
                        <Image
                          src={img}
                          alt={`${p.brand} ${p.name}`}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="px-1 pt-4 pb-6">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-accent-gold">
                        {p.brand}
                      </p>
                      <h3 className="mt-2 font-serif text-lg leading-tight text-foreground group-hover:text-accent-gold transition-colors">
                        {p.name}
                      </h3>
                      {p.reference ? (
                        <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          Ref. {p.reference}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Steps */}
      {steps?.length ? (
        <Section spacing="lg">
          <Container>
            <Heading as="h2" size="lg" className="text-center">
              {stepsHeading}
            </Heading>
            <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <div key={i}>
                  <span className="font-serif text-4xl font-bold text-accent-gold/30">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* FAQ */}
      {faq?.length ? (
        <Section variant="muted" spacing="lg">
          <Container size="narrow">
            <Heading as="h2" size="md" className="text-center">
              {t.faqHeading}
            </Heading>
            <div className="mt-12">
              <FaqAccordion items={faq} />
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Closing CTA */}
      <Section spacing="lg">
        <Container size="narrow" className="text-center">
          <Heading as="h2" size="md">
            {closingHeading}
          </Heading>
          {closingText && (
            <Text muted className="mx-auto mt-4 max-w-xl">
              {closingText}
            </Text>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <ContactLink source={source}>{primaryCtaLabel}</ContactLink>
            </Button>
            <a
              href={`tel:${CONTACT_PHONE_RAW}`}
              className="inline-flex items-center gap-2 border border-border px-6 py-3 font-serif text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold"
            >
              {CONTACT_PHONE}
            </a>
          </div>

          {relatedLinks?.length ? (
            <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {relatedLinks.map((l, i) => (
                <Link
                  key={i}
                  href={localizePath(l.href, locale)}
                  className="inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent-gold transition-colors"
                >
                  {l.label} <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  )
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

export function landingBreadcrumbJsonLd(slug: string, name: string, locale: Locale = 'pl') {
  const homeName = locale === 'en' ? 'Home' : locale === 'ua' ? 'Головна' : 'Strona główna'
  const path = slug.startsWith('/') ? slug : `/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: absoluteUrl('/', locale) },
      { '@type': 'ListItem', position: 2, name, item: absoluteUrl(path, locale) },
    ],
  }
}

export function serviceJsonLd(opts: {
  name: string
  description: string
  serviceType: string
  url: string
  areaServed?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    areaServed: { '@type': opts.areaServed === 'Polska' ? 'Country' : 'City', name: opts.areaServed ?? 'Warszawa' },
    provider: {
      '@type': 'LocalBusiness',
      '@id': 'https://warszawskiczas.pl/#localbusiness',
      name: 'Warszawski Czas',
      url: 'https://warszawskiczas.pl',
      telephone: '+48604501000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ul. Mokotowska 71',
        addressLocality: 'Warszawa',
        postalCode: '00-530',
        addressCountry: 'PL',
      },
    },
  }
}

export function itemListJsonLd(opts: { name: string; url: string; products: Product[]; locale?: Locale }) {
  const locale = opts.locale ?? 'pl'
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    url: opts.url,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.products.length,
      itemListElement: opts.products.slice(0, 30).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/produkty/${productUrlSlug(p)}`, locale),
        name: `${p.brand} ${p.name}`,
      })),
    },
  }
}
