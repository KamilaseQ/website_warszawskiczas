'use client'

import Link from 'next/link'
import { Wrench, ArrowDownToLine, Repeat, ArrowUpRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Container, Section } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { localeFromPathname, localizePath } from '@/lib/i18n'

const services = [
  {
    num: '01',
    eyebrow: 'Atelier zegarmistrzowski',
    duration: 'Indywidualnie',
    icon: Wrench,
    title: 'Naprawa i serwis',
    description:
      'Profesjonalny serwis zegarmistrzowski. Przeglądy, regulacje, naprawy i renowacje zegarków mechanicznych wszystkich marek.',
    href: '/uslugi/naprawa-i-serwis',
  },
  {
    num: '02',
    eyebrow: 'Wycena i transakcja',
    duration: 'Szybko i sprawnie',
    icon: ArrowDownToLine,
    title: 'Skup zegarków',
    description:
      'Uczciwa wycena i natychmiastowa płatność. Skupujemy zegarki premium wszystkich marek, także vintage.',
    href: '/uslugi/skup',
  },
  {
    num: '03',
    eyebrow: 'Sprzedaż dyskretna',
    duration: 'Indywidualnie',
    icon: Repeat,
    title: 'Komis',
    description:
      'Profesjonalna sprzedaż w komisie. Dotrzemy do właściwych kolekcjonerów i uzyskamy najlepszą cenę za Twój zegarek.',
    href: '/uslugi/komis',
  },
]

export function ServicesOverview() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const localized = locale === 'pl' ? services : [
    {
      num: '01',
      eyebrow: locale === 'en' ? 'Watchmaking atelier' : 'Годинникове ательє',
      duration: locale === 'en' ? 'Individual' : 'Індивідуально',
      icon: Wrench,
      title: locale === 'en' ? 'Repair and service' : 'Ремонт і сервіс',
      description: locale === 'en' ? 'Professional watch service, diagnostics, regulation and restoration for mechanical watches from premium brands.' : 'Професійний сервіс, діагностика, регулювання та реставрація механічних годинників преміальних брендів.',
      href: '/uslugi/naprawa-i-serwis',
    },
    {
      num: '02',
      eyebrow: locale === 'en' ? 'Valuation and transaction' : 'Оцінка та угода',
      duration: locale === 'en' ? 'Fast and discreet' : 'Швидко і дискретно',
      icon: ArrowDownToLine,
      title: locale === 'en' ? 'Watch buying' : 'Викуп годинників',
      description: locale === 'en' ? 'Fair valuation and immediate payment for premium watches, including modern and vintage references.' : 'Справедлива оцінка та негайна оплата за преміальні годинники, включно з сучасними й вінтажними референсами.',
      href: '/uslugi/skup',
    },
    {
      num: '03',
      eyebrow: locale === 'en' ? 'Discreet sale' : 'Дискретний продаж',
      duration: locale === 'en' ? 'Individual' : 'Індивідуально',
      icon: Repeat,
      title: locale === 'en' ? 'Consignment' : 'Комісія',
      description: locale === 'en' ? 'Boutique consignment reaches the right collectors and helps achieve a stronger retail price.' : 'Комісійний продаж у бутіку допомагає дістатися до правильних колекціонерів і отримати сильнішу роздрібну ціну.',
      href: '/uslugi/komis',
    },
  ]
  const copy = {
    pl: {
      eyebrow: 'Usługi atelier',
      headingA: 'Ekspercka obsługa',
      headingB: 'na każdym etapie.',
      intro: 'Od pierwszej weryfikacji do późniejszego serwisu — wszystkie etapy życia zegarka pod jednym dachem warszawskiego butiku.',
      learn: 'Dowiedz się więcej',
      scope: 'Zakres usługi',
      outro: 'Mokotowska 71 · Atelier zegarmistrzowski od 2019',
    },
    en: {
      eyebrow: 'Atelier services',
      headingA: 'Expert support',
      headingB: 'at every stage.',
      intro: 'From first verification to later service, every stage of a watch’s life is handled under one Warsaw boutique roof.',
      learn: 'Learn more',
      scope: 'Service scope',
      outro: 'Mokotowska 71 · Watchmaking atelier since 2019',
    },
    ua: {
      eyebrow: 'Послуги ательє',
      headingA: 'Експертний супровід',
      headingB: 'на кожному етапі.',
      intro: 'Від першої перевірки до подальшого сервісу — усі етапи життя годинника під одним дахом варшавського бутіка.',
      learn: 'Дізнатися більше',
      scope: 'Обсяг послуги',
      outro: 'Mokotowska 71 · Годинникове ательє з 2019',
    },
  }[locale]
  return (
    <Section spacing="xl" className="relative overflow-hidden">
      {/* Subtle warmth from the right */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(201,169,98,0.06)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_90%,rgba(122,76,38,0.04)_0%,transparent_55%)]" />

      {/* Vertical decorative typography — left edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] [transform:rotate(180deg)] xl:block"
      >
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold/35">
          Atelier &nbsp;·&nbsp; od 2019
        </span>
      </div>

      <Container className="relative">
        {/* Editorial header — asymmetric two-column */}
        <FadeIn>
          <div className="mb-20 grid gap-10 lg:mb-24 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-accent-gold/60" />
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold">
                  V &nbsp;——&nbsp; {copy.eyebrow}
                </p>
              </div>
              <h2 className="mt-8 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] text-balance leading-[1.05]">
                {copy.headingA}<br />
                <span className="italic font-normal">{copy.headingB}</span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-3">
              <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
                {copy.intro}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Atelier dispatches — 3 horizontal editorial entries */}
        <div className="relative">
          {/* Top hairline */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent"
          />

          {localized.map((service, index) => {
            const Icon = service.icon
            return (
              <FadeIn key={service.num} delay={index * 0.08}>
                <Link
                  href={localizePath(service.href, locale)}
                  className="group relative block border-b border-accent-gold/15"
                >
                  {/* Hover wash — slides in from left */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-accent-gold/[0.07] via-accent-gold/[0.02] to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
                  />

                  {/* Hover hairline — bottom, gold, animates left → right */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-accent-gold transition-transform duration-[800ms] ease-out group-hover:scale-x-100"
                  />

                  <div className="relative grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-5 px-2 py-12 transition-[padding] duration-500 ease-out group-hover:pl-4 sm:gap-x-8 lg:grid-cols-[auto_1fr_auto] lg:gap-x-12 lg:px-4 lg:py-14">
                    {/* LEFT — large italic numeral + gold hairline */}
                    <div className="flex items-baseline gap-5 sm:gap-6">
                      <span className="font-serif italic text-5xl font-normal leading-none text-accent-gold/45 transition-colors duration-500 group-hover:text-accent-gold/85 sm:text-6xl lg:text-7xl">
                        {service.num}
                      </span>
                      <span
                        aria-hidden
                        className="hidden h-14 w-px self-center bg-accent-gold/30 transition-[height,background-color] duration-500 group-hover:h-20 group-hover:bg-accent-gold/55 sm:block"
                      />
                    </div>

                    {/* CENTER — content */}
                    <div className="min-w-0">
                      <p className="flex items-center gap-3 font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                        <Icon className="h-3 w-3" strokeWidth={1.75} />
                        {service.eyebrow}
                      </p>
                      <h3 className="mt-3 font-serif text-2xl font-medium text-foreground transition-colors duration-300 group-hover:text-accent-gold lg:text-[1.75rem]">
                        {service.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty lg:text-[15px]">
                        {service.description}
                      </p>
                      {/* Mobile-only meta row */}
                      <div className="mt-5 flex items-center justify-between gap-4 lg:hidden">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/50">
                          <span className="text-accent-gold/80">·</span>&nbsp;{service.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">
                          {copy.learn}
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>

                    {/* RIGHT — meta + arrow medallion (desktop) */}
                    <div className="relative z-10 hidden flex-col items-end gap-5 self-center lg:flex">
                      <div className="text-right">
                        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/45">
                          {copy.scope}
                        </p>
                        <p className="mt-2 font-serif italic text-base text-foreground/80">
                          {service.duration}
                        </p>
                      </div>
                      <span className="inline-flex h-11 w-11 items-center justify-center border border-accent-gold/30 transition-all duration-300 group-hover:border-accent-gold group-hover:bg-accent-gold/10">
                        <ArrowUpRight className="h-4 w-4 text-accent-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )
          })}
        </div>

        {/* Outro */}
        <FadeIn delay={0.3}>
          <p className="mt-16 text-center font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/45">
            {copy.outro}
          </p>
        </FadeIn>
      </Container>
    </Section>
  )
}
