import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { ContactForm } from '@/components/forms'
import { Container, FaqAccordion, LocationMap, Section, type FaqItem } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import type { Locale } from '@/lib/i18n'

const copy = {
  pl: {
    eyebrow: 'Kontakt',
    h1A: 'Zacznijmy',
    h1B: 'rozmowę.',
    lead:
      'Masz pytanie o zegarek, chcesz poznać kolekcję lub dowiedzieć się więcej o naszych usługach? Odpowiemy w ciągu 24 godzin.',
    formHeading: 'Napisz do nas',
    formLead: 'Jedno miejsce, wszystkie potrzebne pola. Odpowiadamy w ciągu 24 godzin.',
    direct: 'Bezpośrednio',
    hours: 'Godziny otwarcia',
    weekdays: 'Pon - Pt',
    saturday: 'Sobota',
    sunday: 'Niedziela',
    closed: 'Zamknięte',
    address: 'Adres',
    faq: 'FAQ',
    faqHeadingA: 'Zanim napiszesz -',
    faqHeadingB: 'może to już tu jest.',
    noAnswer: 'Nie znalazłeś odpowiedzi?',
    writeUs: 'Napisz do nas',
    orCall: 'lub zadzwoń - chętnie pomożemy.',
    imageAlt: 'Butik Warszawski Czas - przestrzeń kontaktu',
    faqs: [
      {
        q: 'Czy wizyta w butiku wymaga wcześniejszego umówienia?',
        a: 'Nie wymagamy wcześniejszego kontaktu - zapraszamy w godzinach otwarcia. Jeśli chcesz mieć pewność, że nasz specjalista będzie dostępny wyłącznie dla Ciebie, warto umówić wizytę telefonicznie lub przez formularz.',
      },
      {
        q: 'Jak przebiega bezpłatna wycena zegarka?',
        a: 'Wycena zajmuje zwykle 15-30 minut. Oglądamy zegarek, dokumentację, mechanizm i porównujemy z aktualnym rynkiem. Dajemy rzetelną informację o wartości - bez presji sprzedaży.',
      },
      {
        q: 'Jakie dokumenty są potrzebne przy skupie?',
        a: 'Dowód tożsamości. Pudełko i karty gwarancyjne są mile widziane - wpływają na wycenę, ale nie są konieczne. W przypadku zegarków zabytkowych pomocna bywa dokumentacja pochodzenia.',
      },
      {
        q: 'Czy realizujecie transakcje poza Warszawą?',
        a: 'Tak - współpracujemy z klientami z całej Polski. W przypadku cenniejszych egzemplarzy organizujemy bezpieczną kurierską logistykę z ubezpieczeniem lub spotkanie w dogodnej lokalizacji.',
      },
      {
        q: 'Ile trwa typowy serwis zegarka?',
        a: 'Standardowy serwis, czyli smarowanie, regulacja i czyszczenie, trwa zwykle 3-6 tygodni. Przy bardziej złożonych naprawach czas ustalamy indywidualnie po diagnozie.',
      },
    ],
  },
  en: {
    eyebrow: 'Contact',
    h1A: 'Let’s start',
    h1B: 'a conversation.',
    lead:
      'Have a question about a watch, the collection or our services? Send a message and we will usually reply within 24 hours.',
    formHeading: 'Write to us',
    formLead: 'One place for the details we need. We usually respond within 24 hours.',
    direct: 'Directly',
    hours: 'Opening hours',
    weekdays: 'Mon - Fri',
    saturday: 'Saturday',
    sunday: 'Sunday',
    closed: 'Closed',
    address: 'Address',
    faq: 'FAQ',
    faqHeadingA: 'Before you write -',
    faqHeadingB: 'the answer may be here.',
    noAnswer: 'No answer found?',
    writeUs: 'Write to us',
    orCall: 'or call - we will be glad to help.',
    imageAlt: 'Warszawski Czas boutique - contact space',
    faqs: [
      {
        q: 'Do I need to book a visit in advance?',
        a: 'A prior appointment is not required during opening hours. If you want to make sure a specialist is reserved for you, it is worth booking by phone or through the form.',
      },
      {
        q: 'How does a free watch valuation work?',
        a: 'A valuation usually takes 15-30 minutes. We inspect the watch, documentation and movement, then compare it with the current market. You receive a realistic view of value with no pressure to sell.',
      },
      {
        q: 'What documents are needed when selling a watch?',
        a: 'An identity document is required. Box and warranty cards are helpful and may affect valuation, but they are not mandatory. For vintage watches, provenance documentation can also help.',
      },
      {
        q: 'Do you work with clients outside Warsaw?',
        a: 'Yes. We work with clients across Poland. For higher-value pieces we can arrange insured courier logistics or a meeting in a convenient location.',
      },
      {
        q: 'How long does a typical service take?',
        a: 'Standard service, including lubrication, regulation and cleaning, usually takes 3-6 weeks. More complex repairs are estimated individually after diagnosis.',
      },
    ],
  },
  ua: {
    eyebrow: 'Контакт',
    h1A: 'Почнімо',
    h1B: 'розмову.',
    lead:
      'Маєте питання про годинник, колекцію або наші послуги? Напишіть нам - зазвичай ми відповідаємо протягом 24 годин.',
    formHeading: 'Напишіть нам',
    formLead: 'Одне місце для всіх потрібних деталей. Зазвичай відповідаємо протягом 24 годин.',
    direct: 'Безпосередньо',
    hours: 'Години роботи',
    weekdays: 'Пн - Пт',
    saturday: 'Субота',
    sunday: 'Неділя',
    closed: 'Зачинено',
    address: 'Адреса',
    faq: 'FAQ',
    faqHeadingA: 'Перш ніж писати -',
    faqHeadingB: 'можливо, відповідь уже тут.',
    noAnswer: 'Не знайшли відповідь?',
    writeUs: 'Напишіть нам',
    orCall: 'або зателефонуйте - ми охоче допоможемо.',
    imageAlt: 'Бутік Warszawski Czas - простір контакту',
    faqs: [
      {
        q: 'Чи потрібно заздалегідь домовлятися про візит?',
        a: 'Попередній запис не обов’язковий у години роботи. Якщо ви хочете мати впевненість, що спеціаліст буде зарезервований саме для вас, варто домовитися телефоном або через форму.',
      },
      {
        q: 'Як проходить безкоштовна оцінка годинника?',
        a: 'Оцінка зазвичай триває 15-30 хвилин. Ми оглядаємо годинник, документи та механізм, а потім порівнюємо з актуальним ринком. Ви отримуєте реалістичну оцінку без тиску щодо продажу.',
      },
      {
        q: 'Які документи потрібні для викупу?',
        a: 'Потрібен документ, що посвідчує особу. Коробка та гарантійні картки допомагають і можуть впливати на оцінку, але не є обов’язковими. Для вінтажних годинників корисною може бути документація походження.',
      },
      {
        q: 'Чи працюєте ви з клієнтами поза Варшавою?',
        a: 'Так. Ми працюємо з клієнтами з усієї Польщі. Для дорожчих екземплярів можемо організувати застраховану кур’єрську логістику або зустріч у зручному місці.',
      },
      {
        q: 'Скільки триває типовий сервіс?',
        a: 'Стандартний сервіс, тобто змащення, регулювання та очищення, зазвичай триває 3-6 тижнів. Складніші ремонти оцінюємо індивідуально після діагностики.',
      },
    ],
  },
} satisfies Record<Locale, {
  eyebrow: string
  h1A: string
  h1B: string
  lead: string
  formHeading: string
  formLead: string
  direct: string
  hours: string
  weekdays: string
  saturday: string
  sunday: string
  closed: string
  address: string
  faq: string
  faqHeadingA: string
  faqHeadingB: string
  noAnswer: string
  writeUs: string
  orCall: string
  imageAlt: string
  faqs: FaqItem[]
}>

export function ContactPage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = copy[locale]
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Section spacing="lg" className="pt-28 lg:pt-32">
        <Container>
          <FadeIn>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-accent-gold/60" />
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold">
                {t.eyebrow}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <h1 className="max-w-3xl font-serif text-5xl font-medium leading-[1.02] tracking-normal text-foreground text-balance sm:text-6xl lg:text-[5rem]">
              {t.h1A}<br />
              <span className="font-normal italic">{t.h1B}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty lg:text-lg">
              {t.lead}
            </p>
          </FadeIn>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-7">
              <div className="bg-background p-8 lg:p-12">
                <h2 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
                  {t.formHeading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {t.formLead}
                </p>
                <div className="mt-8">
                  <ContactForm locale={locale} />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-5">
              <div className="space-y-10">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image src="/kontakt.webp" alt={t.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>

                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                    {t.direct}
                  </p>

                  <a href="tel:+48604501000" className="group mt-4 flex items-center justify-between gap-4 border-b border-border py-5 transition-colors duration-300 hover:border-accent-gold">
                    <div className="flex items-center gap-4">
                      <Phone className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
                      <span className="font-serif text-xl font-medium text-foreground transition-colors duration-300 group-hover:text-accent-gold">
                        +48 604 50 1000
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-gold" />
                  </a>

                  <a href="mailto:biuro@warszawskiczas.pl" className="group mt-0 flex items-center justify-between gap-4 border-b border-border py-5 transition-colors duration-300 hover:border-accent-gold">
                    <div className="flex items-center gap-4">
                      <Mail className="h-4 w-4 text-accent-gold" strokeWidth={1.5} />
                      <span className="font-sans text-base text-foreground transition-colors duration-300 group-hover:text-accent-gold">
                        biuro@warszawskiczas.pl
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-gold" />
                  </a>

                  <a href="https://wa.me/48604501000" target="_blank" rel="noopener noreferrer" className="group mt-0 flex items-center justify-between gap-4 border-b border-border py-5 transition-colors duration-300 hover:border-accent-gold">
                    <div className="flex items-center gap-4">
                      <svg className="h-4 w-4 text-accent-gold" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413A11.815 11.815 0 0012.05 0Z" />
                      </svg>
                      <span className="font-sans text-base text-foreground transition-colors duration-300 group-hover:text-accent-gold">
                        WhatsApp
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-gold" />
                  </a>
                </div>

                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                    {t.hours}
                  </p>
                  <div className="mt-4 space-y-2 font-sans text-sm text-foreground">
                    <div className="flex justify-between gap-6">
                      <span>{t.weekdays}</span>
                      <span className="tabular-nums">11:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>{t.saturday}</span>
                      <span className="tabular-nums">11:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between gap-6 text-muted-foreground">
                      <span>{t.sunday}</span>
                      <span>{t.closed}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                    {t.address}
                  </p>
                  <p className="mt-3 font-serif text-xl font-medium text-foreground">Mokotowska 71</p>
                  <p className="font-serif text-base italic text-muted-foreground">Warszawa, 00-530</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <FadeIn>
            <div className="relative">
              <LocationMap className="aspect-[4/3] sm:aspect-[21/9]" />
              <div className="pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full border border-accent-gold/30 lg:block" />
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container size="narrow">
          <FadeIn>
            <div className="mb-10 flex items-center gap-4">
              <div className="h-px w-12 bg-accent-gold/60" />
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold">
                {t.faq}
              </p>
            </div>
            <h2 className="font-serif text-3xl font-medium tracking-normal text-foreground text-balance sm:text-4xl">
              {t.faqHeadingA}<br />
              <span className="font-normal italic">{t.faqHeadingB}</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-12">
              <FaqAccordion items={t.faqs} />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-12 text-center text-sm text-muted-foreground">
              {t.noAnswer}{' '}
              <Link href="#top" className="text-accent-gold hover:underline">
                {t.writeUs}
              </Link>{' '}
              {t.orCall}
            </p>
          </FadeIn>
        </Container>
      </Section>
    </>
  )
}
