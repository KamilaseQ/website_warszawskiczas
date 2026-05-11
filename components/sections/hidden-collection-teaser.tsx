'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Container, Section, ImagePlaceholder, KenBurns, ScrollDrift } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { localeFromPathname, localizePath } from '@/lib/i18n'

export function HiddenCollectionTeaser() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const featureRef = useRef<HTMLDivElement>(null)
  const copy = {
    pl: {
      eyebrow: 'Kolekcja prywatna — dostęp na zaproszenie',
      h1a: 'Kolekcja,',
      h1b: 'której nie znajdziesz',
      h1c: 'w katalogu',
      text: 'Zegarki z prywatnych kolekcji — wyjątkowe egzemplarze, które udostępniamy po krótkim, indywidualnym kontakcie z naszym specjalistą.',
      cta: 'Wejdź do kolekcji prywatnej',
      label: 'Kolekcja Prywatna',
      caption: 'Zegarki z prywatnych kolekcji, wyjątkowe dzieła sztuki.',
    },
    en: {
      eyebrow: 'Private collection — access by invitation',
      h1a: 'A collection',
      h1b: 'you will not find',
      h1c: 'in the catalogue',
      text: 'Watches from private collections — exceptional pieces presented after a short, individual conversation with our specialist.',
      cta: 'Enter the private collection',
      label: 'Private Collection',
      caption: 'Watches from private collections, exceptional mechanical objects.',
    },
    ua: {
      eyebrow: 'Приватна колекція — доступ за запрошенням',
      h1a: 'Колекція,',
      h1b: 'якої ви не знайдете',
      h1c: 'у каталозі',
      text: 'Годинники з приватних колекцій — виняткові екземпляри, які ми показуємо після короткої індивідуальної розмови зі спеціалістом.',
      cta: 'Увійти до приватної колекції',
      label: 'Приватна колекція',
      caption: 'Годинники з приватних колекцій, виняткові механічні об’єкти.',
    },
  }[locale]

  return (
    <Section spacing="lg" className="relative overflow-hidden bg-[#0b1410] text-white">
      {/* Grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />

      {/* Subtle green/gold ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(201,169,98,0.08)_0%,transparent_50%)]" />

      <Container className="relative">
        <div ref={featureRef} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* LEWA — tekst */}
          <FadeIn direction="right">
            <ScrollDrift targetRef={featureRef} start={-140} end={130} className="lg:-mt-10">
              <p className="mb-6 flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
                <Lock className="h-3 w-3" />
                {copy.eyebrow}
              </p>

              <h2 className="font-serif text-4xl font-medium tracking-tight text-white text-balance sm:text-5xl lg:text-[3.5rem] leading-[1.05]">
                {copy.h1a}<br />
                <span className="italic font-normal">{copy.h1b}</span>
                <br /> {copy.h1c}
              </h2>

              <p className="mt-8 max-w-md text-base leading-relaxed text-white/60 text-pretty">
                {copy.text}
              </p>

              <Link
                href={localizePath('/kolekcja-na-zapytanie', locale)}
                prefetch
                className="mt-10 inline-block btn-sharp"
                style={{ backgroundColor: 'hsl(42 50% 45%)', color: '#0a0a0a' }}
              >
                {copy.cta}
              </Link>
            </ScrollDrift>
          </FadeIn>

          {/* PRAWA — jedno editorialne zdjęcie z Ken Burns */}
          <FadeIn direction="left" delay={0.15}>
            <div className="relative">
              <div className="relative w-full overflow-hidden">
                <div className="relative aspect-[4/5]">
                  <KenBurns intensity={1.2} drift className="absolute inset-0">
                    <ImagePlaceholder
                      className="absolute inset-0"
                      variant="dark"
                      label=""
                      showDial={true}
                    />
                    <Image
                      src="/Franck Muller Vegas4.jpg"
                      alt="Franck Muller Vegas"
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: '50% center' }}
                    />
                  </KenBurns>

                  {/* Editorial overlay — vignette + warm tone */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-black/15 to-accent-gold/[0.05]" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_25%,transparent_0%,rgba(0,0,0,0.45)_100%)] mix-blend-multiply" />

                  {/* Gold corner crop marks (top-left, bottom-right) */}
                  <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-4 w-4">
                    <span className="absolute left-0 top-0 h-px w-4 bg-accent-gold/70" />
                    <span className="absolute left-0 top-0 h-4 w-px bg-accent-gold/70" />
                  </span>
                  <span aria-hidden className="pointer-events-none absolute right-3 bottom-3 h-4 w-4">
                    <span className="absolute right-0 bottom-0 h-px w-4 bg-accent-gold/70" />
                    <span className="absolute right-0 bottom-0 h-4 w-px bg-accent-gold/70" />
                  </span>

                  {/* Top-left meta — "Kolekcja Prywatna" */}
                  <div className="absolute left-6 top-6 flex items-center gap-2.5">
                    <Lock className="h-3 w-3 text-accent-gold" />
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.4em] text-accent-gold/85">
                      {copy.label}
                    </span>
                  </div>

                </div>
              </div>

              {/* Offset gold border — dekoracyjne, jak w boutique-preview */}
              <div className="pointer-events-none absolute -bottom-5 -right-5 hidden h-full w-full border border-accent-gold/25 lg:block" />

              {/* Caption editorial */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px w-8 bg-accent-gold/60" />
                <span className="font-serif italic text-sm text-white/55">
                  {copy.caption}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}
