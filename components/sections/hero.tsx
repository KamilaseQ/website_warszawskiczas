'use client'

import Link from 'next/link'
import { ContactLink } from '@/components/contact-link'
import { FadeIn } from '@/components/ui/fade-in'
import { Magnetic } from '@/components/ui'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { localeFromPathname, localizePath } from '@/lib/i18n'

export function Hero() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const contentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const startVideo = () => {
      const v = videoRef.current
      if (!v) return
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    const flag = (window as unknown as { __wcLoadingFinished?: boolean }).__wcLoadingFinished
    if (flag) {
      startVideo()
      return
    }

    window.addEventListener('wc-loading-finish', startVideo, { once: true })
    return () => window.removeEventListener('wc-loading-finish', startVideo)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      const y = window.scrollY
      contentRef.current.style.transform = `translateY(${y * 0.25}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollDown = () => {
    const target = document.getElementById('product-showcase')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }
  }
  const copy = {
    pl: {
      h1a: 'Luksusowe',
      h1b: 'Zegarki',
      lead: 'Wyselekcjonowana kolekcja dla wymagających kolekcjonerów',
      consult: 'Umów prywatną konsultację',
      discover: 'Odkryj kolekcję',
      scroll: 'Przewiń',
      scrollAria: 'Przewiń do kolekcji',
    },
    en: {
      h1a: 'Luxury',
      h1b: 'Watches',
      lead: 'A curated collection for demanding collectors',
      consult: 'Book a private consultation',
      discover: 'Discover the collection',
      scroll: 'Scroll',
      scrollAria: 'Scroll to the collection',
    },
    ua: {
      h1a: 'Люксові',
      h1b: 'Годинники',
      lead: 'Кураторська колекція для вимогливих колекціонерів',
      consult: 'Записатися на приватну консультацію',
      discover: 'Відкрити колекцію',
      scroll: 'Прокрутити',
      scrollAria: 'Прокрутити до колекції',
    },
  }[locale]

  return (
    <section className="relative flex min-h-[100vh] w-full flex-col items-center justify-center overflow-hidden bg-black">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          className="h-full w-full object-cover"
          style={{ filter: 'saturate(1.15) contrast(1.1) brightness(0.88) sepia(0.12) hue-rotate(-8deg)' }}
        >
          <source src="/rolex.mp4" type="video/mp4" />
        </video>

        {/* Multi-layered Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/20 to-transparent h-48" />
        <div className="absolute inset-0 top-auto bg-gradient-to-t from-black/95 via-black/50 to-transparent h-1/2" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[300px] bg-black/40 blur-3xl rounded-[100%]" />
        </div>
      </div>

      {/* 1.1 Dekoracyjny pionowy tekst po lewej */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
        style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
      >
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.75em] text-white/25">
          Warszawa · Mokotowska 71
        </span>
      </div>

      {/* Dekoracyjny pionowy numer po prawej */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-serif italic text-xs tracking-[0.4em] text-white/20">
          Est. 2019 — No. 01
        </span>
      </div>

      {/* Content — wycentrowane */}
      <div
        ref={contentRef}
        className="relative z-20 flex w-full max-w-5xl flex-col items-center px-6 text-center will-change-transform"
      >
        <FadeIn direction="up" className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent-gold">
            Mokotowska 71 &nbsp;·&nbsp; Warszawa
          </span>
        </FadeIn>

        <FadeIn delay={0.1} direction="up">
          {/* 1.1 — powiększony H1 na desktopie, H1 jako element wizualny */}
          <h1 className="font-serif text-5xl font-medium tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[7.5rem] xl:text-[8.5rem] drop-shadow-xl text-balance leading-[0.95]">
            {copy.h1a}<br />
            <span className="italic font-normal">{copy.h1b}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2} direction="up" className="mt-8">
          <p className="max-w-xl font-sans text-xs md:text-sm font-extralight tracking-[0.22em] uppercase text-white/70 text-balance leading-loose drop-shadow-sm">
            {copy.lead}
          </p>
        </FadeIn>

        {/* CTA — primary: "Umów prywatną konsultację", secondary tekst-link "Odkryj kolekcję" */}
        <FadeIn delay={0.4} direction="up" className="mt-12 sm:mt-12 flex items-center justify-center gap-6 sm:gap-8 relative flex-wrap hero-mobile-breathe">
          <div className="absolute inset-y-[-2rem] left-0 right-0 bg-black/40 blur-2xl z-0 rounded-full pointer-events-none" />

          {/* PRIMARY — Umów prywatną konsultację (magnetic hover) */}
          <Magnetic className="relative z-10" strength={10}>
            <ContactLink source="home-hero" prefetch className="btn-premium-white inline-block">
              {copy.consult}
            </ContactLink>
          </Magnetic>

          {/* TERTIARY — tekst-link z strzałką: Odkryj kolekcję */}
          <Link
            href={localizePath('/produkty', locale)}
            prefetch
            className="relative z-10 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 transition-colors duration-300 hover:text-accent-gold group"
          >
            {copy.discover}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </FadeIn>
      </div>

      {/* Scroll Indicator */}
      <button
        type="button"
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 cursor-pointer bg-transparent border-none p-0"
        aria-label={copy.scrollAria}
      >
        <div className="scroll-indicator-group flex flex-col items-center gap-2">
          <span className="scroll-indicator-label">{copy.scroll}</span>
          <ChevronDown
            className="scroll-indicator-icon scroll-indicator-bounce h-4 w-4 transition-colors"
            style={{ color: 'rgba(245, 243, 239, 0.4)' }}
          />
        </div>
      </button>
    </section>
  )
}
