import Link from 'next/link'
import { ArrowRight, Check, Mail, Phone } from 'lucide-react'
import { Container, Section } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { localizePath, type Locale } from '@/lib/i18n'

const copy = {
  pl: {
    eyebrow: 'Wiadomość wysłana',
    h1A: 'Dziękujemy,',
    h1B: 'odezwiemy się wkrótce.',
    lead:
      'Nasz specjalista skontaktuje się z Tobą w ciągu 24 godzin roboczych. W sprawach pilnych zapraszamy do kontaktu telefonicznego lub WhatsApp.',
    back: 'Powrót do strony głównej',
  },
  en: {
    eyebrow: 'Message sent',
    h1A: 'Thank you,',
    h1B: 'we will be in touch shortly.',
    lead:
      'Our specialist will contact you within one business day. For urgent matters, please call us or use WhatsApp.',
    back: 'Back to home',
  },
  ua: {
    eyebrow: 'Повідомлення надіслано',
    h1A: 'Дякуємо,',
    h1B: 'ми скоро зв’яжемося.',
    lead:
      'Наш спеціаліст зв’яжеться з вами протягом одного робочого дня. У термінових питаннях телефонуйте або пишіть у WhatsApp.',
    back: 'Повернутися на головну',
  },
} satisfies Record<Locale, Record<string, string>>

export function ThankYouPage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = copy[locale]

  return (
    <Section spacing="lg">
      <Container size="narrow" className="text-center">
        <FadeIn>
          <div className="mx-auto flex h-20 w-20 items-center justify-center border border-accent-gold/40 bg-accent-gold/10">
            <Check className="h-8 w-8 text-accent-gold" strokeWidth={1.5} />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-10 font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold">
            {t.eyebrow}
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h1 className="mt-6 font-serif text-4xl font-medium tracking-normal text-foreground text-balance sm:text-5xl lg:text-6xl">
            {t.h1A}<br />
            <span className="font-normal italic">{t.h1B}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-8 h-px w-16 bg-accent-gold/60" />
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            {t.lead}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="tel:+48604501000" className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-accent-gold">
              <Phone className="h-4 w-4" />
              +48 604 50 1000
            </a>
            <span className="hidden text-muted-foreground/40 sm:inline">·</span>
            <a href="mailto:biuro@warszawskiczas.pl" className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-accent-gold">
              <Mail className="h-4 w-4" />
              biuro@warszawskiczas.pl
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Link
            href={localizePath('/', locale)}
            className="group mt-16 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-accent-gold"
          >
            {t.back}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </FadeIn>
      </Container>
    </Section>
  )
}
