'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, ImagePlaceholder, KenBurns, Magnetic, ScrollDrift } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { featuredProduct, otherFeaturedProducts, productUrlSlug } from '@/data/mock-products'
import { localeFromPathname, localizePath } from '@/lib/i18n'
import { localizeProduct } from '@/lib/localized-products'

export function ProductShowcase() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const copy = {
    pl: {
      week: 'Zegarek Tygodnia',
      date: 'Kwiecień 2026',
      full: 'Pełna kolekcja',
      photoSoon: 'Zdjęcie wkrótce',
      askAvailability: 'Zapytaj o dostępność',
      freeConsult: 'Bezpłatna wycena i konsultacja',
      discover: 'Odkryj więcej',
      other: 'Inne modele w butiku',
      prev: 'Poprzedni',
      next: 'Następny',
      ask: 'Zapytaj',
      item: 'pozycja',
    },
    en: {
      week: 'Watch of the Week',
      date: 'April 2026',
      full: 'Full collection',
      photoSoon: 'Photo coming soon',
      askAvailability: 'Ask about availability',
      freeConsult: 'Free valuation and consultation',
      discover: 'Discover more',
      other: 'Other models in the boutique',
      prev: 'Previous',
      next: 'Next',
      ask: 'Ask',
      item: 'item',
    },
    ua: {
      week: 'Годинник тижня',
      date: 'Квітень 2026',
      full: 'Вся колекція',
      photoSoon: 'Фото незабаром',
      askAvailability: 'Запитати про наявність',
      freeConsult: 'Безкоштовна оцінка і консультація',
      discover: 'Відкрити більше',
      other: 'Інші моделі в бутіку',
      prev: 'Попередній',
      next: 'Наступний',
      ask: 'Запитати',
      item: 'позиція',
    },
  }[locale]
  const localizedFeatured = localizeProduct(featuredProduct, locale)

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const delta = el.clientWidth * 0.8 * (dir === 'left' ? -1 : 1)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <Section id="product-showcase" spacing="lg" className="relative overflow-hidden">
      {/* Dekoracyjna cyfra "01" za tekstem (depth Vogue) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[28rem] font-medium leading-none text-accent-gold/[0.035] lg:block"
      >
        01
      </div>

      <Container>
        {/* Eyebrow editorial header */}
        <FadeIn>
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
                I &nbsp;——&nbsp; {copy.week}
              </p>
              <p className="mt-2 font-serif italic text-sm text-muted-foreground">
                No. 01 · {copy.date}
              </p>
            </div>
            <Link
              href={localizePath('/produkty', locale)}
              prefetch
              className="group inline-flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-[0.35em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {copy.full}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        {/* Główny układ editorial — 2 kolumny asymetryczne */}
        <div ref={featuredRef} className="relative grid items-stretch gap-8 lg:grid-cols-12 lg:gap-16">
          {/* LEWA — obraz bohater */}
          <FadeIn direction="right" className="lg:col-span-7">
            <div className="relative">
              {/* Etykieta "Zegarek Tygodnia" — złota wstążka */}
              <div className="absolute left-0 top-0 z-20 flex items-center gap-2 bg-accent-gold px-4 py-2">
                <span className="h-1 w-1 bg-[#0a0a0a]" />
                <span className="font-serif text-[10px] font-medium uppercase tracking-[0.35em] text-[#0a0a0a]">
                  {copy.week}
                </span>
              </div>

              <KenBurns
                intensity={1.18}
                targetRef={featuredRef}
                offset={['start 85%', 'end 15%']}
                className="relative aspect-[4/5] w-full sm:aspect-[3/4]"
              >
                {featuredProduct.images?.[0] ? (
                  <Image
                    src={featuredProduct.images[0]}
                    alt={`${featuredProduct.brand} ${featuredProduct.name}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder
                    className="absolute inset-0"
                    variant="light"
                    label={copy.photoSoon}
                  />
                )}
                <div className="pointer-events-none absolute inset-4 border border-accent-gold/10" />
              </KenBurns>

              {/* Podpis edytorialny pod obrazem */}
              <div className="mt-4 flex items-center">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                  {featuredProduct.brand} · {featuredProduct.reference}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* PRAWA — tekst editorialny */}
          <FadeIn direction="left" delay={0.15} className="lg:col-span-5">
            <ScrollDrift
              targetRef={featuredRef}
              start={-130}
              end={125}
              className="flex h-full flex-col justify-center lg:-mt-10"
            >
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
                {copy.week}
              </p>

              <p className="mt-3 font-serif italic text-sm text-muted-foreground">
                No. 01 · {copy.date}
              </p>

              <h2 className="mt-6 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-[4rem] leading-[1]">
                {featuredProduct.brand}
              </h2>
              <h3 className="mt-2 font-serif italic text-2xl font-normal text-foreground/80 sm:text-4xl">
                {featuredProduct.name}
              </h3>

              <p className="mt-6 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Ref. {featuredProduct.reference} &nbsp;·&nbsp; {featuredProduct.year}
              </p>

              {/* Złoty separator */}
              <div className="mt-8 h-px w-16 bg-accent-gold/60" />

              <p className="mt-8 font-sans text-base leading-relaxed text-muted-foreground text-pretty">
                  {localizedFeatured.editorial ??
                  '[OPIS MODELU DO UZUPEŁNIENIA — charakter, historia referencji, dlaczego wart uwagi.]'}
              </p>

              {/* CTA editorial — magnetic hover */}
              <Magnetic className="mt-10 block w-full" strength={8}>
                <ContactLink
                  source="product-showcase"
                  prefetch
                  className="btn-sharp w-full text-center"
                  style={{ display: 'block' }}
                >
                  {copy.askAvailability}
                </ContactLink>
              </Magnetic>
              <p className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                {copy.freeConsult}
              </p>
            </ScrollDrift>
          </FadeIn>
        </div>

        {/* Mini-showcase — inne modele */}
        <div className="mt-28 lg:mt-36">
          <FadeIn>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
                  {copy.discover}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  {copy.other}
                </h3>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => scrollBy('left')}
                  aria-label={copy.prev}
                  className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors duration-300 hover:border-accent-gold hover:text-accent-gold"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy('right')}
                  aria-label={copy.next}
                  className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors duration-300 hover:border-accent-gold hover:text-accent-gold"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Pasek kart — full-bleed, przewijalny swipe.
          scroll-pl odpowiada px-* (oraz lg side-padding) tak, żeby po snapie
          karta nie wpadała pod paddng i była zawsze widoczna od lewej krawędzi. */}
      <FadeIn delay={0.1}>
        <div
          ref={scrollerRef}
          className="no-scrollbar mt-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 scroll-pl-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:scroll-pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {otherFeaturedProducts.map((p, i) => (
            <Link
              key={p.id}
              href={localizePath(`/produkty/${productUrlSlug(p)}`, locale)}
              prefetch={false}
              className="group relative block w-[58vw] flex-shrink-0 snap-start sm:w-[44vw] lg:w-[22vw]"
            >
              <div className="relative aspect-[3/4] overflow-hidden transition-all duration-500 group-hover:-translate-y-1">
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={`${p.brand} ${p.name}`}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 78vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <ImagePlaceholder className="absolute inset-0" variant="light" />
                )}
                <div className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent-gold/40" />
              </div>
              <div className="mt-4">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-accent-gold">
                  {p.brand}
                </p>
                <h4 className="mt-1 font-serif text-lg font-medium text-foreground">
                  {p.name}
                </h4>
                <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Ref. {p.reference} · {p.year}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/70 transition-colors duration-300 group-hover:text-accent-gold">
                  {copy.ask} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
              <span className="sr-only">{copy.item} {i + 1}</span>
            </Link>
          ))}
        </div>
      </FadeIn>
    </Section>
  )
}
