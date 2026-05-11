import Image from 'next/image'
import { Lock } from 'lucide-react'
import { Container, Section } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import type { Locale } from '@/lib/i18n'

const copy = {
  pl: {
    sideLeft: 'Kolekcja na zapytanie',
    sideRight: 'Warszawa  ·  Mokotowska',
    eyebrow: 'Dostęp ograniczony',
    h1a: 'Kolekcja',
    h1b: 'Prywatna',
    lead:
      'Zegarki z prywatnych kolekcji, których nie znajdziesz w katalogu butiku. Dostęp dajemy po krótkim, indywidualnym kontakcie — telefonicznie lub przez formularz.',
    invite: 'Dostęp na zaproszenie',
    since: 'Warszawski Czas  ·  od 2019',
  },
  en: {
    sideLeft: 'Collection on request',
    sideRight: 'Warsaw  ·  Mokotowska',
    eyebrow: 'Restricted access',
    h1a: 'Private',
    h1b: 'Collection',
    lead:
      'Watches from private collections that never appear in the boutique catalogue. Access is granted after a brief, personal conversation — by phone or contact form.',
    invite: 'By invitation',
    since: 'Warszawski Czas  ·  since 2019',
  },
  ua: {
    sideLeft: 'Колекція на запит',
    sideRight: 'Варшава  ·  Mokotowska',
    eyebrow: 'Обмежений доступ',
    h1a: 'Приватна',
    h1b: 'колекція',
    lead:
      'Годинники з приватних колекцій, яких немає в каталозі бутіка. Доступ надаємо після короткої індивідуальної розмови — телефоном або через форму.',
    invite: 'За запрошенням',
    since: 'Warszawski Czas  ·  з 2019',
  },
} as const

export function PrivateCollectionHero({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = copy[locale]
  return (
    <Section
      spacing="xl"
      className="relative overflow-hidden bg-[#050403] text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/watch-31.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover [filter:brightness(0.62)_contrast(1.05)_saturate(0.82)_sepia(0.14)]"
          style={{ objectPosition: '50% 40%' }}
        />
        <div className="absolute inset-0 bg-[#050403]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,rgba(5,4,3,0.55)_70%,rgba(5,4,3,0.92)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050403] via-[#050403]/70 to-transparent" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_30%,rgba(201,169,98,0.14)_0%,transparent_55%)] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_90%,rgba(201,169,98,0.08)_0%,transparent_55%)] mix-blend-screen" />

      <div className="pointer-events-none absolute left-6 top-1/2 hidden h-[40%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-accent-gold/30 to-transparent lg:block" />
      <div className="pointer-events-none absolute right-6 top-1/2 hidden h-[40%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-accent-gold/30 to-transparent lg:block" />

      <div className="pointer-events-none absolute left-10 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] [transform:rotate(180deg)_translateX(50%)] origin-center xl:block">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold/45">
          {t.sideLeft}
        </span>
      </div>
      <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] origin-center xl:block">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
          {t.sideRight}
        </span>
      </div>

      <Container className="relative pt-20 pb-12 sm:pt-24">
        <FadeIn>
          <p className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
            <Lock className="h-3 w-3 lock-pulse" />
            {t.eyebrow}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-8 font-serif text-5xl font-medium tracking-tight text-white sm:text-7xl lg:text-[7rem] leading-[0.98] text-balance">
            {t.h1a}<br />
            <span className="italic font-normal shimmer-gold">{t.h1b}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-10 max-w-xl font-sans text-base leading-relaxed text-white/55 text-pretty lg:text-lg">
            {t.lead}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-14 flex items-end justify-between gap-6 border-t border-accent-gold/20 pt-6">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-accent-gold/60" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white/45">
                {t.invite}
              </span>
            </div>
            <span className="hidden font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 sm:inline">
              {t.since}
            </span>
          </div>
        </FadeIn>

      </Container>
    </Section>
  )
}
