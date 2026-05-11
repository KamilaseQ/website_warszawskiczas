'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Container, Section, ImagePlaceholder, KenBurns, ScrollDrift } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { localeFromPathname } from '@/lib/i18n'

const values = [
  {
    num: '01',
    title: 'Weryfikacja i autentyczność',
    description:
      'Każdy egzemplarz przechodzi wieloetapową kontrolę ekspercką. Certyfikat i pełna dokumentacja.',
  },
  {
    num: '02',
    title: 'Zegarki z historią',
    description:
      'Nie handlujemy anonimową masą. Znamy pochodzenie każdego modelu i opowiadamy jego historię.',
  },
  {
    num: '03',
    title: 'Relacja, nie transakcja',
    description:
      'Po zakupie jesteśmy dostępni — serwis, doradztwo, ewentualna odsprzedaż po latach.',
  },
]

export function BrandPositioning() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const featureRef = useRef<HTMLDivElement>(null)
  const copy = {
    pl: {
      eyebrow: 'Filozofia butiku',
      h1a: 'Zegarek to nie przedmiot.',
      h1b: 'To',
      h1c: 'wybór',
      h1d: 'który mówi, kim',
      h1e: 'jesteś',
      text: 'Warszawski Czas to butik, w którym mechaniczna precyzja spotyka się z kulturą i historią. Każdy zegarek to rozmowa — o stylu, o czasie, o człowieku, który go wybiera.',
      imageLabel: 'Zdjęcie: makro tarczy / dłonie zegarmistrza',
      values,
    },
    en: {
      eyebrow: 'Boutique philosophy',
      h1a: 'A watch is not just an object.',
      h1b: 'It is',
      h1c: 'a choice',
      h1d: 'that says who',
      h1e: 'you are',
      text: 'Warszawski Czas is a boutique where mechanical precision meets culture and history. Every watch begins a conversation about style, time and the person who chooses it.',
      imageLabel: 'Photo: dial macro / watchmaker hands',
      values: [
        { num: '01', title: 'Verification and authenticity', description: 'Every piece goes through expert verification with documentation and clear provenance.' },
        { num: '02', title: 'Watches with history', description: 'We do not sell anonymous stock. We care about origin, reference and the story behind every model.' },
        { num: '03', title: 'Relationship, not transaction', description: 'After purchase, we remain available for service, advice and future resale guidance.' },
      ],
    },
    ua: {
      eyebrow: 'Філософія бутіка',
      h1a: 'Годинник — це не просто предмет.',
      h1b: 'Це',
      h1c: 'вибір',
      h1d: 'який говорить, ким',
      h1e: 'ви є',
      text: 'Warszawski Czas — бутік, де механічна точність зустрічається з культурою та історією. Кожен годинник починає розмову про стиль, час і людину, яка його обирає.',
      imageLabel: 'Фото: макро циферблата / руки годинникаря',
      values: [
        { num: '01', title: 'Перевірка та автентичність', description: 'Кожен екземпляр проходить експертну перевірку з документами та зрозумілим походженням.' },
        { num: '02', title: 'Годинники з історією', description: 'Ми не продаємо анонімний товар. Нас цікавить походження, референс і історія кожної моделі.' },
        { num: '03', title: 'Відносини, не транзакція', description: 'Після покупки ми залишаємося доступними для сервісу, порад і майбутнього перепродажу.' },
      ],
    },
  }[locale]

  return (
    <Section variant="muted" spacing="lg" className="relative overflow-hidden">
      <Container>
        <FadeIn>
          <div className="mb-12 flex items-center gap-4">
            <div className="h-px w-12 bg-accent-gold/60" />
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
              III &nbsp;——&nbsp; {copy.eyebrow}
            </p>
          </div>
        </FadeIn>

        <div ref={featureRef} className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEWA — duży cytat editorialny */}
          <FadeIn direction="right" className="lg:col-span-7">
            <div className="relative">
              {/* Duża dekoracyjna cyfra w tle */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -left-4 select-none font-serif italic text-[14rem] font-medium leading-none text-accent-gold/[0.05] lg:text-[18rem]"
              >
                "
              </span>

              <h2 className="relative font-serif text-4xl font-medium tracking-tight text-foreground text-balance leading-[1.1] sm:text-5xl lg:text-6xl">
                {copy.h1a}<br />
                {copy.h1b} <span className="font-serif italic font-normal text-accent-gold">{copy.h1c}</span>,
                {' '}{copy.h1d} <span className="font-serif italic font-normal">{copy.h1e}</span>.
              </h2>

              <p className="mt-10 max-w-lg font-sans text-base leading-relaxed text-muted-foreground text-pretty">
                {copy.text}
              </p>

              {/* Placeholder zdjęcia makro tarczy — wystaje poza kontener */}
              <div className="relative mt-12 hidden lg:block">
                <KenBurns
                  intensity={1.24}
                  drift
                  className="aspect-[16/10] w-[90%] translate-x-8"
                >
                  <ImagePlaceholder
                    className="h-full w-full"
                    variant="light"
                    label={copy.imageLabel}
                  />
                  <Image
                    src="/Patek Philippe Nautilus-12.jpg"
                    alt="Patek Philippe Nautilus"
                    fill
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: '50% center' }}
                  />
                </KenBurns>
                {/* Offset border dekoracyjna */}
                <div className="pointer-events-none absolute -bottom-4 left-8 h-full w-[90%] border border-accent-gold/20" />
              </div>
            </div>
          </FadeIn>

          {/* PRAWA — 3 punkty z numerami */}
          <ScrollDrift
            targetRef={featureRef}
            start={-110}
            end={150}
            className="flex flex-col gap-10 lg:col-span-5 lg:pt-16"
          >
            {copy.values.map((v, index) => (
              <FadeIn key={v.num} direction="left" delay={index * 0.1}>
                <div className="group relative border-t border-border pt-6">
                  <div className="flex items-baseline gap-6">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold/70">
                      {v.num}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-medium text-foreground transition-colors duration-300 group-hover:text-accent-gold">
                        {v.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.35}>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px w-16 bg-accent-gold/60" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                  Mokotowska 71 · Warszawa
                </span>
              </div>
            </FadeIn>
          </ScrollDrift>
        </div>
      </Container>
    </Section>
  )
}
