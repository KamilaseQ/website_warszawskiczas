import { ArrowRight } from 'lucide-react'
import { Container, Section, FaqAccordion, Magnetic, type FaqItem } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import type { Locale } from '@/lib/i18n'

const copy = {
  pl: {
    eyebrow: 'Najczęstsze pytania',
    h2a: 'Najczęstsze pytania',
    h2b: 'o kolekcję prywatną.',
    stillQuestions: 'Nadal masz pytania?',
    stillIntro: 'Specjalista odpowie indywidualnie, w ciągu 24 godzin.',
    cta: 'Skontaktuj się ze specjalistą',
    faqs: [
      {
        q: 'Dlaczego ta kolekcja jest poza katalogiem?',
        a: 'Właściciele zegarków z prywatnych kolekcji preferują indywidualne podejście. Część egzemplarzy nie trafia do publicznego katalogu, by zachować spokojną, kameralną formę kontaktu z zainteresowanymi.',
      },
      {
        q: 'Jak zweryfikować autentyczność?',
        a: 'Każdy egzemplarz przechodzi wieloetapowy proces weryfikacji przez zegarmistrzów i ekspertów. Sprawdzamy mechanizm, numer seryjny, stan koperty i tarczy oraz porównujemy z dokumentacją producenta. Certyfikat w komplecie.',
      },
      {
        q: 'Jak przebiega zakup?',
        a: 'Kontakt ze specjalistą, spotkanie w butiku na Mokotowskiej lub w dogodnym miejscu, prezentacja zegarka, omówienie warunków i bezpieczna, poufna transakcja. Pełna dokumentacja i gwarancja.',
      },
      {
        q: 'Czy mogę kupić w imieniu osoby trzeciej lub jako prezent?',
        a: 'Tak — oferujemy pełne wsparcie przy zakupie z dostawą do wybranej osoby, eleganckim pakowaniem oraz indywidualnym podejściem do logistyki.',
      },
      {
        q: 'Jaki jest zakres cenowy kolekcji?',
        a: 'Kolekcja Prywatna obejmuje zegarki z segmentu premium i ultra-premium — od kilkudziesięciu tysięcy do kilku milionów złotych za egzemplarz. Szczegółową wycenę omawiamy indywidualnie.',
      },
    ] as FaqItem[],
  },
  en: {
    eyebrow: 'Frequently asked questions',
    h2a: 'Frequently asked questions',
    h2b: 'about the private collection.',
    stillQuestions: 'Still have questions?',
    stillIntro: 'Our specialist will reply personally within 24 hours.',
    cta: 'Contact the specialist',
    faqs: [
      {
        q: 'Why is this collection outside the catalogue?',
        a: 'Owners of watches in private collections prefer a personal approach. Some pieces never enter the public catalogue, so the contact with interested clients stays calm and intimate.',
      },
      {
        q: 'How is authenticity verified?',
        a: 'Every piece goes through a multi-stage verification by our watchmakers and experts. We check the movement, serial number, case and dial condition, and cross-reference with the manufacturer’s documentation. Certificate included.',
      },
      {
        q: 'How does the purchase work?',
        a: 'Contact with the specialist, a meeting at the boutique on Mokotowska or another convenient location, presentation of the watch, discussion of terms and a secure, confidential transaction. Full documentation and warranty.',
      },
      {
        q: 'Can I buy on behalf of someone else or as a gift?',
        a: 'Yes — we provide full support including delivery to the chosen person, elegant packaging and a personal approach to logistics.',
      },
      {
        q: 'What is the price range?',
        a: 'The Private Collection covers premium and ultra-premium watches — from tens of thousands to several million złoty per piece. Detailed pricing is discussed individually.',
      },
    ] as FaqItem[],
  },
  ua: {
    eyebrow: 'Поширені запитання',
    h2a: 'Поширені запитання',
    h2b: 'про приватну колекцію.',
    stillQuestions: 'Залишилися питання?',
    stillIntro: 'Спеціаліст відповість індивідуально протягом 24 годин.',
    cta: 'Зв’язатися зі спеціалістом',
    faqs: [
      {
        q: 'Чому ця колекція поза каталогом?',
        a: 'Власники годинників із приватних колекцій надають перевагу індивідуальному підходу. Частина екземплярів не потрапляє до публічного каталогу — заради спокійного та камерного контакту з зацікавленими.',
      },
      {
        q: 'Як перевіряється автентичність?',
        a: 'Кожен екземпляр проходить багатоетапну перевірку нашими годинникарями та експертами. Перевіряємо механізм, серійний номер, стан корпусу та циферблата і звіряємо з документацією виробника. Сертифікат у комплекті.',
      },
      {
        q: 'Як відбувається купівля?',
        a: 'Контакт зі спеціалістом, зустріч у бутіку на Mokotowska або в зручному місці, презентація годинника, обговорення умов і безпечна, конфіденційна угода. Повна документація та гарантія.',
      },
      {
        q: 'Чи можна купити для іншої особи або як подарунок?',
        a: 'Так — забезпечуємо повну підтримку, включно з доставкою обраній особі, елегантним пакуванням та індивідуальним підходом до логістики.',
      },
      {
        q: 'Який ціновий діапазон колекції?',
        a: 'Приватна колекція охоплює годинники сегмента premium і ultra-premium — від десятків тисяч до кількох мільйонів злотих за екземпляр. Деталі обговорюємо індивідуально.',
      },
    ] as FaqItem[],
  },
} as const

export function PrivateCollectionFAQ({ locale = 'pl' }: { locale?: Locale } = {}) {
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
    <Section spacing="lg" className="relative overflow-hidden bg-[#050403] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,169,98,0.08)_0%,transparent_55%)]" />

      <Container size="narrow" className="relative">
        <FadeIn>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-accent-gold/60" />
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
              {t.eyebrow}
            </p>
          </div>
          <h2 className="mt-8 font-serif text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl text-balance leading-[1.02]">
            {t.h2a}<br />
            <span className="italic font-normal">{t.h2b}</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-16">
            <FaqAccordion items={t.faqs} variant="dark" numbering="roman" />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-accent-gold">
                {t.stillQuestions}
              </p>
              <p className="mt-3 font-serif italic text-lg text-white/70 sm:text-xl">
                {t.stillIntro}
              </p>
            </div>
            <Magnetic strength={6}>
              <a
                href="#registration"
                className="inline-flex items-center gap-3 border-b border-accent-gold/50 pb-1 text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-accent-gold transition-colors duration-300 hover:text-[#dab97c] hover:border-accent-gold"
              >
                {t.cta}
                <ArrowRight className="h-3 w-3" />
              </a>
            </Magnetic>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}
