import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactLink } from '@/components/contact-link'
import { ProductCatalog } from '@/components/products'
import { RelatedGrid } from '@/components/products'
import { ProductGallery } from '@/components/products/product-gallery'
import { SeoLanding, landingBreadcrumbJsonLd, serviceJsonLd } from '@/components/seo/seo-landing'
import {
  BrandPositioning,
  BoutiquePreview,
  FinalCTA,
  Hero,
  HiddenCollectionTeaser,
  ProductShowcase,
  ServicesOverview,
  TrustSignals,
} from '@/components/sections'
import { Button, Container, FaqAccordion, Heading, Section, Text, type FaqItem } from '@/components/ui'
import { findProductByUrlSlug, mockProducts, productUrlSlug } from '@/data/mock-products'
import { CONTACT_PHONE, CONTACT_PHONE_RAW } from '@/lib/config'
import { absoluteUrl, canonicalPath, isLocale, localizedAlternates, localizePath, publicRoutePaths, type Locale } from '@/lib/i18n'
import { getLocalizedLanding, localizedLandingSlugs } from '@/lib/localized-landings'
import { formatProductPrice, localizeProduct } from '@/lib/localized-products'
import { PrivateCollectionPage } from '@/components/pages/private-collection-page'
import { AccessibilityStatementPage } from '@/components/pages/accessibility-statement-page'
import { BoutiquePage } from '@/components/pages/boutique-page'
import { ContactPage } from '@/components/pages/contact-page'
import { ThankYouPage } from '@/components/pages/thank-you-page'
import {
  ConsignmentServicePage,
  RepairServicePage,
  ServicesPage,
  WatchBuyingServicePage,
} from '@/components/pages/services-pages'

// dynamicParams = true so URL-encoded Unicode segments (Cyrillic UA slugs)
// route reliably; unknown routes still 404 via notFound() after canonicalisation.
export const dynamicParams = true

interface PageProps {
  params: Promise<{ locale: string; path?: string[] }>
}

const localizedLocales = ['en', 'ua'] as const

function safeDecode(seg: string): string {
  try {
    return decodeURIComponent(seg)
  } catch {
    return seg
  }
}

function routeFromPath(path: string[] | undefined, locale: Exclude<Locale, 'pl'>) {
  // Next.js may pass either decoded or URL-encoded segments depending on the
  // request path; normalise to decoded UTF-8 before any slug logic.
  const decoded = (path ?? []).map(safeDecode)
  const localized = `/${decoded.join('/')}`.replace(/\/$/, '') || '/'
  const canonical = canonicalPath(localized, locale)
  // Round-trip guard: if the incoming localized path doesn't match the
  // canonical re-localised in this locale, the URL used wrong slugs (e.g.
  // PL slug under /en/) — 404 to avoid duplicate content.
  const expected = localizePath(canonical, locale).replace(new RegExp(`^/${locale}`), '') || '/'
  if (expected !== localized) notFound()
  return canonical
}

function assertLocale(locale: string): Exclude<Locale, 'pl'> {
  if (locale !== 'en' && locale !== 'ua') notFound()
  return locale
}

export async function generateStaticParams() {
  const productPaths = mockProducts.map((p) => `/produkty/${productUrlSlug(p)}`)
  const canonicalRoutes = [...publicRoutePaths, ...productPaths]

  return localizedLocales.flatMap((locale) =>
    canonicalRoutes.map((canonical) => {
      const localized = localizePath(canonical, locale)
      const segments = localized.split('/').filter(Boolean)
      // First segment is the locale prefix (e.g. 'en', 'ua') — strip it for [[...path]] params.
      segments.shift()
      return {
        locale,
        path: segments,
      }
    }),
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, path } = await params
  const locale = assertLocale(rawLocale)
  const route = routeFromPath(path, locale)

  if (route.startsWith('/produkty/')) {
    const slug = route.replace('/produkty/', '')
    const source = findProductByUrlSlug(slug) ?? mockProducts.find((p) => p.slug === slug)
    if (!source) return { title: locale === 'en' ? 'Product not found' : 'Товар не знайдено', robots: { index: false, follow: true } }
    const product = localizeProduct(source, locale)
    const canonicalSlug = productUrlSlug(source)
    const image = source.images?.[0] ? absoluteUrl(source.images[0]) : absoluteUrl('/opengraph-image.jpg')
    const title =
      locale === 'en'
        ? `${product.brand} ${product.name}${product.reference ? ` · ref. ${product.reference}` : ''} - luxury watch Warsaw`
        : `${product.brand} ${product.name}${product.reference ? ` · ref. ${product.reference}` : ''} - люксовий годинник Варшава`
    return {
      title,
      description: product.description,
      alternates: localizedAlternates(`/produkty/${canonicalSlug}`, locale),
      openGraph: {
        type: 'article',
        url: absoluteUrl(`/produkty/${canonicalSlug}`, locale),
        title,
        description: product.description,
        siteName: 'Warszawski Czas',
        locale: locale === 'en' ? 'en_US' : 'uk_UA',
        images: [{ url: image, alt: `${product.brand} ${product.name}` }],
      },
      twitter: { card: 'summary_large_image', title, description: product.description, images: [image] },
    }
  }

  if (route === '/produkty') return productListMetadata(locale)

  const landingSlug = route.slice(1)
  if (localizedLandingSlugs.includes(landingSlug)) {
    const page = getLocalizedLanding(landingSlug, locale)
    if (!page) notFound()
    return {
      title: page.title,
      description: page.description,
      alternates: localizedAlternates(route, locale),
      openGraph: {
        type: 'website',
        url: absoluteUrl(route, locale),
        title: page.title,
        description: page.description,
        siteName: 'Warszawski Czas',
        locale: locale === 'en' ? 'en_US' : 'uk_UA',
        images: [{ url: absoluteUrl('/opengraph-image.jpg'), alt: page.title }],
      },
      twitter: { card: 'summary_large_image', title: page.title, description: page.description },
    }
  }

  const simple = simplePageCopy(route, locale)
  if (simple) {
    return {
      title: simple.title,
      description: simple.description,
      alternates: localizedAlternates(route, locale),
      openGraph: {
        type: 'website',
        url: absoluteUrl(route, locale),
        title: simple.title,
        description: simple.description,
        siteName: 'Warszawski Czas',
        locale: locale === 'en' ? 'en_US' : 'uk_UA',
      },
      twitter: { card: 'summary_large_image', title: simple.title, description: simple.description },
      robots: simple.noIndex ? { index: false, follow: true } : undefined,
    }
  }

  if (route === '/') {
    const title = locale === 'en' ? 'Warszawski Czas | Luxury Watches Warsaw' : 'Warszawski Czas | Люксові годинники Варшава'
    const description =
      locale === 'en'
        ? 'Premium watch boutique in the heart of Warsaw. Exclusive watches, certified pieces, watch buying, consignment and service at Mokotowska 71.'
        : 'Бутік преміальних годинників у центрі Варшави. Ексклюзивні годинники, перевірені екземпляри, викуп, комісія та сервіс на Mokotowska 71.'
    return {
      title,
      description,
      alternates: localizedAlternates('/', locale),
      openGraph: {
        type: 'website',
        url: absoluteUrl('/', locale),
        title,
        description,
        siteName: 'Warszawski Czas',
        locale: locale === 'en' ? 'en_US' : 'uk_UA',
      },
      twitter: { card: 'summary_large_image', title, description },
    }
  }

  return { title: locale === 'en' ? 'Page not found' : 'Сторінку не знайдено', robots: { index: false, follow: false } }
}

export default async function LocalizedPage({ params }: PageProps) {
  const { locale: rawLocale, path } = await params
  const locale = assertLocale(rawLocale)
  const route = routeFromPath(path, locale)

  if (route === '/') return <LocalizedHome />
  if (route === '/kolekcja-na-zapytanie') return <PrivateCollectionPage locale={locale} />
  if (route === '/butik') return <BoutiquePage locale={locale} />
  if (route === '/kontakt') return <ContactPage locale={locale} />
  if (route === '/kontakt/dziekujemy') return <ThankYouPage locale={locale} />
  if (route === '/deklaracja-dostepnosci') return <AccessibilityStatementPage locale={locale} />
  if (route === '/uslugi') return <ServicesPage locale={locale} />
  if (route === '/uslugi/skup') return <WatchBuyingServicePage locale={locale} />
  if (route === '/uslugi/komis') return <ConsignmentServicePage locale={locale} />
  if (route === '/uslugi/naprawa-i-serwis') return <RepairServicePage locale={locale} />
  if (route === '/produkty') return <LocalizedProducts locale={locale} />
  if (route.startsWith('/produkty/')) return <LocalizedProductDetail route={route} locale={locale} />

  const landingSlug = route.slice(1)
  if (localizedLandingSlugs.includes(landingSlug)) {
    const page = getLocalizedLanding(landingSlug, locale)
    if (!page) notFound()
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              serviceJsonLd({
                name: page.serviceName,
                serviceType: page.serviceType,
                description: page.description,
                url: absoluteUrl(route, locale),
                areaServed: page.areaServed ?? (locale === 'en' ? 'Warsaw' : 'Warszawa'),
              }),
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(route, page.h1, locale)) }}
        />
        <SeoLanding {...page} locale={locale} />
      </>
    )
  }

  const simple = simplePageCopy(route, locale)
  if (simple) {
    return <SimpleLocalizedPage page={simple} locale={locale} route={route} />
  }

  notFound()
}

function LocalizedHome() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <TrustSignals />
      <BrandPositioning />
      <HiddenCollectionTeaser />
      <ServicesOverview />
      <BoutiquePreview />
      <FinalCTA />
    </>
  )
}

function productListMetadata(locale: Exclude<Locale, 'pl'>): Metadata {
  const title = locale === 'en' ? 'Luxury watches in Warsaw - Warszawski Czas catalogue' : 'Люксові годинники у Варшаві - каталог Warszawski Czas'
  const description =
    locale === 'en'
      ? 'Catalogue of certified luxury watches available in the boutique at Mokotowska 71: Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier and more.'
      : 'Каталог перевірених люксових годинників у бутіку на Mokotowska 71: Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier та інші.'
  return {
    title,
    description,
    alternates: localizedAlternates('/produkty', locale),
    openGraph: {
      type: 'website',
      url: absoluteUrl('/produkty', locale),
      title,
      description,
      siteName: 'Warszawski Czas',
      locale: locale === 'en' ? 'en_US' : 'uk_UA',
    },
  }
}

function LocalizedProducts({ locale }: { locale: Exclude<Locale, 'pl'> }) {
  const products = mockProducts.map((p) => localizeProduct(p, locale))
  const title = locale === 'en' ? 'Available watches in the boutique' : 'Годинники доступні в бутіку'
  const intro =
    locale === 'en'
      ? 'Every piece is checked for authenticity and condition before it enters the catalogue.'
      : 'Кожен екземпляр перевіряється на автентичність і стан перед додаванням до каталогу.'
  const quote =
    locale === 'en'
      ? 'The most beautiful watches are not the loudest. They are the ones that stay with us discreetly for decades.'
      : 'Найкрасивіші годинники не найгучніші. Це ті, що дискретно супроводжують нас десятиліттями.'

  return (
    <>
      <Section variant="muted" spacing="sm" className="border-b border-border pt-28 lg:pt-32">
        <Container>
          <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                {locale === 'en' ? 'Catalogue' : 'Каталог'} · {mockProducts.filter((p) => p.category === 'zegarki').length}
              </p>
              <h1 className="mt-3 font-serif text-3xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground sm:text-base text-pretty">
                {intro}
              </p>
            </div>
            <div className="hidden lg:col-span-5 lg:block lg:border-l lg:border-border lg:pl-8">
              <p className="font-serif text-sm italic text-muted-foreground sm:text-base text-pretty">&ldquo;{quote}&rdquo;</p>
              <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">- Warszawski Czas</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="sm">
        <Container>
          <ProductCatalog products={products} />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="narrow" className="text-center">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
            {locale === 'en' ? 'Still looking?' : 'Не знайшли?'}
          </p>
          <Heading as="h2" size="md" className="mt-4">
            {locale === 'en' ? 'Part of the collection is private' : 'Частина колекції не є публічною'}
          </Heading>
          <Text muted className="mx-auto mt-4 max-w-xl">
            {locale === 'en'
              ? 'Private collection pieces, on-request watches and models reserved for returning clients are available after a short conversation.'
              : 'Годинники з приватних колекцій, моделі за запитом і позиції для постійних клієнтів доступні після короткої розмови.'}
          </Text>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href={localizePath('/kolekcja-na-zapytanie', locale)}>
                {locale === 'en' ? 'Private Collection' : 'Приватна колекція'}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <ContactLink source="product-listing">{locale === 'en' ? 'Contact us' : 'Зв’язатися'}</ContactLink>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

const certificationFaq = (locale: Exclude<Locale, 'pl'>): FaqItem[] =>
  locale === 'en'
    ? [
        { q: 'What does the authenticity certificate include?', a: 'A description of the watch, reference number, production year where available, condition notes and the verification date.' },
        { q: 'How do you verify authenticity?', a: 'We check markings, movement, case, bracelet, documents, service history and reference consistency.' },
        { q: 'Do you offer a guarantee?', a: 'Yes. Boutique warranty is available for the movement unless stated otherwise for a specific piece.' },
      ]
    : [
        { q: 'Що містить сертифікат автентичності?', a: 'Опис годинника, номер референсу, рік виробництва за наявності, примітки щодо стану та дату перевірки.' },
        { q: 'Як ви перевіряєте автентичність?', a: 'Ми перевіряємо маркування, механізм, корпус, браслет, документи, сервісну історію та відповідність референсу.' },
        { q: 'Чи надаєте гарантію?', a: 'Так. Гарантія бутіка на механізм доступна, якщо для конкретного екземпляра не зазначено інше.' },
      ]

function LocalizedProductDetail({ route, locale }: { route: string; locale: Exclude<Locale, 'pl'> }) {
  const slug = route.replace('/produkty/', '')
  const source = findProductByUrlSlug(slug) ?? mockProducts.find((p) => p.slug === slug)
  if (!source) notFound()
  const product = localizeProduct(source, locale)
  const price = formatProductPrice(source, locale)
  const canonicalSlug = productUrlSlug(source)
  const productLabel = `${product.brand} ${product.name}`
  const productUrl = absoluteUrl(`/produkty/${canonicalSlug}`, locale)
  const productImages = (source.images ?? []).map((src) => absoluteUrl(src))
  const related = mockProducts
    .filter((p) => p.id !== source.id && p.category === source.category)
    .slice(0, 3)
    .map((p) => localizeProduct(p, locale))

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.name}`,
    brand: { '@type': 'Brand', name: product.brand },
    model: product.name,
    category: locale === 'en' ? 'Luxury watches' : 'Люксові годинники',
    description: product.description,
    sku: product.reference,
    mpn: product.reference,
    image: productImages.length ? productImages : undefined,
    url: productUrl,
    material: product.material,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'PLN',
      price: source.price ?? undefined,
      availability:
        source.status === 'Niedostępny'
          ? 'https://schema.org/SoldOut'
          : source.status === 'Zarezerwowany'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Warszawski Czas', url: absoluteUrl('/', locale) },
      areaServed: { '@type': 'Country', name: 'PL' },
    },
  }

  const homeName = locale === 'en' ? 'Home' : 'Головна'
  const catalogueName = locale === 'en' ? 'Watches' : 'Годинники'
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: absoluteUrl('/', locale) },
      { '@type': 'ListItem', position: 2, name: catalogueName, item: absoluteUrl('/produkty', locale) },
      { '@type': 'ListItem', position: 3, name: productLabel, item: productUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Section spacing="sm" className="pt-28 lg:pt-32">
        <Container>
          <Link
            href={localizePath('/produkty', locale)}
            className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground transition-colors hover:text-accent-gold"
          >
            <span aria-hidden>←</span> {locale === 'en' ? 'Back to catalogue' : 'Назад до каталогу'}
          </Link>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ProductGallery brand={product.brand} name={product.name} images={source.images} />
            </div>
            <div className="flex flex-col lg:col-span-5 lg:py-4">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">{product.brand}</p>
              <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl">{product.name}</h1>
              {product.reference && (
                <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Ref. {product.reference}
                  {product.year ? ` · ${product.year}` : ''}
                </p>
              )}
              <div className="my-8 h-px w-12 bg-accent-gold" />
              <Text className="text-base leading-relaxed text-foreground/85">{product.description}</Text>
              {product.editorial && <p className="mt-6 font-serif text-base italic leading-relaxed text-muted-foreground">&ldquo;{product.editorial}&rdquo;</p>}
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-6">
                {product.year && <Spec label={locale === 'en' ? 'Year' : 'Рік'} value={String(product.year)} />}
                {product.condition && <Spec label={locale === 'en' ? 'Condition' : 'Стан'} value={product.condition} />}
                {product.material && <Spec label={locale === 'en' ? 'Material' : 'Матеріал'} value={product.material} />}
                {product.reference && <Spec label={locale === 'en' ? 'Reference' : 'Референс'} value={product.reference} />}
                {product.caseSize && <Spec label={locale === 'en' ? 'Size' : 'Розмір'} value={product.caseSize} />}
              </dl>
              <div className="mt-8">
                {price && <p className="font-serif text-3xl font-medium text-foreground">{price}</p>}
                <div className="mt-6 flex flex-col gap-3">
                  <Button asChild className="w-full" size="lg">
                    <ContactLink source="product-detail" product={productLabel}>
                      {locale === 'en' ? 'Ask about availability' : 'Запитати про наявність'}
                    </ContactLink>
                  </Button>
                  <a
                    href={`tel:${CONTACT_PHONE_RAW}`}
                    className="inline-flex items-center justify-center gap-2 border border-border px-8 py-3 font-serif text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold"
                  >
                    {locale === 'en' ? 'Call' : 'Зателефонувати'} · {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
              {locale === 'en' ? 'Certification' : 'Сертифікація'}
            </p>
            <Heading as="h2" size="md" className="mt-4">
              {locale === 'en' ? 'Authenticity confirmed' : 'Автентичність підтверджена'}
            </Heading>
            <Text muted className="mx-auto mt-4 max-w-xl">
              {locale === 'en'
                ? 'Every watch in our boutique is verified before it enters the catalogue.'
                : 'Кожен годинник у нашому бутіку проходить перевірку перед додаванням до каталогу.'}
            </Text>
          </div>
          <div className="mt-12">
            <FaqAccordion items={certificationFaq(locale)} />
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section spacing="lg">
          <Container>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                  {locale === 'en' ? 'You may also like' : 'Вас також може зацікавити'}
                </p>
                <Heading as="h2" size="md" className="mt-4">
                  {locale === 'en' ? 'Similar models' : 'Подібні моделі'}
                </Heading>
              </div>
            </div>
            <RelatedGrid products={related} />
          </Container>
        </Section>
      )}
    </>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/70">{label}</dt>
      <dd className="mt-1 font-serif text-lg text-foreground">{value}</dd>
    </div>
  )
}

type SimplePage = {
  title: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  cta: string
  bullets: string[]
  noIndex?: boolean
}

function simplePageCopy(route: string, locale: Exclude<Locale, 'pl'>): SimplePage | null {
  const en = locale === 'en'
  const map: Record<string, SimplePage> = {
    '/butik': {
      title: en ? 'Watch boutique Warsaw - Warszawski Czas Mokotowska 71' : 'Бутік годинників у Варшаві - Warszawski Czas Mokotowska 71',
      description: en ? 'Visit the Warszawski Czas luxury watch boutique at Mokotowska 71 in Warsaw.' : 'Відвідайте бутік люксових годинників Warszawski Czas на Mokotowska 71 у Варшаві.',
      eyebrow: en ? 'Boutique · Mokotowska 71' : 'Бутік · Mokotowska 71',
      h1: en ? 'A private watch boutique in Warsaw' : 'Приватний годинниковий бутік у Варшаві',
      intro: en ? 'Warszawski Czas is a discreet boutique for collectors and private clients looking for verified luxury watches, service, valuation and sourcing.' : 'Warszawski Czas — дискретний бутік для колекціонерів і приватних клієнтів, які шукають перевірені люксові годинники, сервіс, оцінку та пошук.',
      cta: en ? 'Book a visit' : 'Записатися на візит',
      bullets: en ? ['Private consultations at Mokotowska 71', 'Verified luxury watches and collector pieces', 'Buying, consignment, sourcing and service'] : ['Приватні консультації на Mokotowska 71', 'Перевірені люксові та колекційні годинники', 'Викуп, комісія, пошук і сервіс'],
    },
    '/kontakt': {
      title: en ? 'Contact Warszawski Czas - luxury watches Warsaw' : 'Контакт Warszawski Czas - люксові годинники Варшава',
      description: en ? 'Contact the Warszawski Czas boutique at Mokotowska 71 in Warsaw.' : 'Зв’яжіться з бутіком Warszawski Czas на Mokotowska 71 у Варшаві.',
      eyebrow: en ? 'Contact' : 'Контакт',
      h1: en ? 'Contact the boutique' : 'Зв’яжіться з бутіком',
      intro: en ? 'Write, call or visit us at Mokotowska 71. We respond to watch enquiries, valuations and sourcing requests.' : 'Напишіть, зателефонуйте або відвідайте нас на Mokotowska 71. Ми відповідаємо щодо годинників, оцінки та пошуку.',
      cta: en ? 'Send a message' : 'Надіслати повідомлення',
      bullets: en ? ['Phone: +48 604 50 1000', 'Email: biuro@warszawskiczas.pl', 'Address: ul. Mokotowska 71, 00-530 Warsaw'] : ['Телефон: +48 604 50 1000', 'Email: biuro@warszawskiczas.pl', 'Адреса: ul. Mokotowska 71, 00-530 Варшава'],
    },
    '/kontakt/dziekujemy': {
      title: en ? 'Thank you - Warszawski Czas' : 'Дякуємо - Warszawski Czas',
      description: en ? 'Thank you for contacting Warszawski Czas.' : 'Дякуємо за контакт із Warszawski Czas.',
      eyebrow: en ? 'Message sent' : 'Повідомлення надіслано',
      h1: en ? 'Thank you for your message' : 'Дякуємо за повідомлення',
      intro: en ? 'We will respond as soon as possible, usually within one business day.' : 'Ми відповімо якнайшвидше, зазвичай протягом одного робочого дня.',
      cta: en ? 'Back to catalogue' : 'Назад до каталогу',
      bullets: [],
      noIndex: true,
    },
    '/kolekcja-na-zapytanie': {
      title: en ? 'Private watch collection Warsaw - hidden collection on request' : 'Приватна колекція годинників у Варшаві - на запит',
      description: en ? 'Private and hidden collection of luxury watches available after a discreet consultation.' : 'Приватна й прихована колекція люксових годинників, доступна після дискретної консультації.',
      eyebrow: en ? 'Private Collection' : 'Приватна колекція',
      h1: en ? 'Hidden watches available on request' : 'Приховані годинники доступні за запитом',
      intro: en ? 'Some watches are never published openly. We present private collection pieces to verified clients after a short consultation.' : 'Частина годинників ніколи не публікується відкрито. Ми показуємо приватні екземпляри перевіреним клієнтам після короткої консультації.',
      cta: en ? 'Request private access' : 'Запросити приватний доступ',
      bullets: en ? ['Unpublished watches', 'Rare references and private consignments', 'Discreet client verification'] : ['Неопубліковані годинники', 'Рідкісні референси та приватні комісійні позиції', 'Дискретна перевірка клієнта'],
    },
    '/polityka-prywatnosci': legalCopy(locale, 'privacy'),
    '/regulamin': legalCopy(locale, 'terms'),
    '/deklaracja-dostepnosci': {
      title: en ? 'Accessibility statement - Warszawski Czas' : 'Декларація доступності - Warszawski Czas',
      description: en
        ? 'Digital accessibility statement for the Warszawski Czas website.'
        : 'Декларація цифрової доступності сайту Warszawski Czas.',
      eyebrow: en ? 'Legal document' : 'Юридичний документ',
      h1: en ? 'Accessibility statement' : 'Декларація доступності',
      intro: en
        ? 'This page describes the accessibility status of the website and how to report barriers.'
        : 'Ця сторінка описує статус доступності сайту та спосіб повідомлення про бар’єри.',
      cta: en ? 'Contact the boutique' : 'Зв’язатися з бутіком',
      bullets: en
        ? ['WCAG 2.2 AA is the target standard.', 'Accessibility barriers can be reported by form, email or phone.', 'Every report is handled as a priority.']
        : ['Цільовий стандарт - WCAG 2.2 AA.', 'Про бар’єри доступності можна повідомити через форму, email або телефон.', 'Кожне повідомлення розглядається як пріоритетне.'],
    },
    '/uslugi': serviceCopy(locale, 'services'),
    '/uslugi/skup': serviceCopy(locale, 'buying'),
    '/uslugi/komis': serviceCopy(locale, 'consignment'),
    '/uslugi/naprawa-i-serwis': serviceCopy(locale, 'repair'),
  }
  return map[route] ?? null
}

function legalCopy(locale: Exclude<Locale, 'pl'>, type: 'privacy' | 'terms'): SimplePage {
  const en = locale === 'en'
  const privacy = type === 'privacy'
  return {
    title: en ? (privacy ? 'Privacy policy - Warszawski Czas' : 'Terms - Warszawski Czas') : privacy ? 'Політика конфіденційності - Warszawski Czas' : 'Правила - Warszawski Czas',
    description: en ? 'Legal information for clients of Warszawski Czas.' : 'Юридична інформація для клієнтів Warszawski Czas.',
    eyebrow: en ? 'Legal' : 'Юридична інформація',
    h1: en ? (privacy ? 'Privacy policy' : 'Terms and conditions') : privacy ? 'Політика конфіденційності' : 'Правила',
    intro: en ? 'This page summarises the rules for communication, personal data and boutique services.' : 'Ця сторінка описує правила комунікації, персональних даних і послуг бутіка.',
    cta: en ? 'Contact the boutique' : 'Зв’язатися з бутіком',
    bullets: en
      ? ['Data is processed to respond to enquiries and provide boutique services.', 'Clients may request access, correction or deletion of personal data.', 'Commercial terms are agreed individually before each transaction.']
      : ['Дані обробляються для відповіді на запити та надання послуг бутіка.', 'Клієнти можуть запросити доступ, виправлення або видалення персональних даних.', 'Комерційні умови узгоджуються індивідуально перед кожною угодою.'],
  }
}

function serviceCopy(locale: Exclude<Locale, 'pl'>, type: 'services' | 'buying' | 'consignment' | 'repair'): SimplePage {
  const en = locale === 'en'
  const data = {
    services: en
      ? ['Services', 'Watch services in Warsaw', 'Buying, consignment, sourcing, valuation and watchmaking support under one boutique roof.']
      : ['Послуги', 'Годинникові послуги у Варшаві', 'Викуп, комісія, пошук, оцінка та годинниковий сервіс в одному бутіку.'],
    buying: en
      ? ['Watch buying', 'Sell a luxury watch in Warsaw', 'Fast valuation, discreet verification and same-day payment after boutique inspection.']
      : ['Викуп годинників', 'Продайте люксовий годинник у Варшаві', 'Швидка оцінка, дискретна перевірка й оплата після огляду в бутіку.'],
    consignment: en
      ? ['Consignment', 'Sell through boutique consignment', 'A stronger retail route for owners who want boutique presentation and collector reach.']
      : ['Комісія', 'Продаж через комісійний бутік', 'Роздрібний шлях для власників, які хочуть презентацію в бутіку та доступ до колекціонерів.'],
    repair: en
      ? ['Repair and service', 'Watch repair and service in Warsaw', 'Mechanical watch service, regulation, diagnostics and care for premium brands.']
      : ['Ремонт і сервіс', 'Ремонт і сервіс годинників у Варшаві', 'Сервіс механічних годинників, регулювання, діагностика та догляд за преміальними брендами.'],
  }[type]
  return {
    title: `${data[1]} - Warszawski Czas`,
    description: data[2],
    eyebrow: data[0],
    h1: data[1],
    intro: data[2],
    cta: en ? 'Book a consultation' : 'Записатися на консультацію',
    bullets: en
      ? ['Private consultation at Mokotowska 71', 'Transparent next steps before any transaction', 'Discreet service for premium watches']
      : ['Приватна консультація на Mokotowska 71', 'Прозорі наступні кроки перед кожною угодою', 'Дискретний сервіс для преміальних годинників'],
  }
}

function SimpleLocalizedPage({
  page,
  locale,
  route,
}: {
  page: SimplePage
  locale: Exclude<Locale, 'pl'>
  route: string
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingBreadcrumbJsonLd(route, page.h1, locale)) }}
      />
      <SeoLanding
        locale={locale}
        eyebrow={page.eyebrow}
        h1={page.h1}
        intro={page.intro}
        primaryCtaLabel={page.cta}
        source={`simple-${route}-${locale}`}
        highlights={[
          { title: locale === 'en' ? 'Private service' : 'Приватний сервіс', description: locale === 'en' ? 'A discreet boutique process for clients who value clarity and calm.' : 'Дискретний процес у бутіку для клієнтів, які цінують ясність і спокій.' },
          { title: locale === 'en' ? 'Expert verification' : 'Експертна перевірка', description: locale === 'en' ? 'We verify references, condition and documentation before recommendations.' : 'Ми перевіряємо референси, стан і документи перед рекомендаціями.' },
          { title: 'Mokotowska 71', description: locale === 'en' ? 'Meet us in the centre of Warsaw or start remotely.' : 'Зустріньтеся з нами в центрі Варшави або почніть дистанційно.' },
        ]}
        bulletsHeading={locale === 'en' ? 'What matters' : 'Що важливо'}
        bullets={page.bullets}
        stepsHeading={locale === 'en' ? 'Next steps' : 'Наступні кроки'}
        steps={
          locale === 'en'
            ? [
                { title: 'Contact', description: 'Send a message, call or book a boutique visit.' },
                { title: 'Consultation', description: 'We clarify the goal and choose the right route.' },
                { title: 'Verification', description: 'If a watch is involved, we verify it carefully.' },
                { title: 'Decision', description: 'You receive a clear recommendation and next step.' },
              ]
            : [
                { title: 'Контакт', description: 'Надішліть повідомлення, зателефонуйте або запишіться до бутіка.' },
                { title: 'Консультація', description: 'Ми уточнюємо мету й обираємо правильний шлях.' },
                { title: 'Перевірка', description: 'Якщо йдеться про годинник, ретельно його перевіряємо.' },
                { title: 'Рішення', description: 'Ви отримуєте чітку рекомендацію та наступний крок.' },
              ]
        }
        closingHeading={locale === 'en' ? 'Speak with Warszawski Czas' : 'Поговоріть із Warszawski Czas'}
        closingText={locale === 'en' ? 'We respond to enquiries personally and discreetly.' : 'Ми відповідаємо на запити особисто та дискретно.'}
        relatedLinks={[
          { href: '/produkty', label: locale === 'en' ? 'Catalogue' : 'Каталог' },
          { href: '/kontakt', label: locale === 'en' ? 'Contact' : 'Контакт' },
          { href: '/butik', label: locale === 'en' ? 'Boutique' : 'Бутік' },
        ]}
      />
      {route === '/kontakt' ? (
        <Section spacing="lg" variant="muted">
          <Container>
            <div className="grid gap-8 lg:grid-cols-3">
              {['+48 604 50 1000', 'biuro@warszawskiczas.pl', 'ul. Mokotowska 71, 00-530 Warszawa'].map((item) => (
                <div key={item} className="border-l-2 border-accent-gold/50 pl-6">
                  <p className="font-serif text-xl text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
