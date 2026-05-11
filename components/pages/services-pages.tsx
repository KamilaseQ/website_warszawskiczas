import Link from 'next/link'
import {
  ArrowDownToLine,
  ArrowRight,
  Award,
  Banknote,
  Camera,
  Check,
  Clock,
  Eye,
  Repeat,
  Shield,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react'
import { Container, Section, Heading, Text, Card } from '@/components/ui'
import { InquiryForm } from '@/components/forms'
import { localizePath, type Locale } from '@/lib/i18n'

const servicesOverviewCopy = {
  pl: {
    title: 'Usługi eksperckie',
    lead:
      'Pełen zakres usług dla właścicieli i kolekcjonerów zegarków. Każde zlecenie traktujemy indywidualnie, z zachowaniem najwyższych standardów jakości.',
    learnMore: 'Dowiedz się więcej',
    why: 'Dlaczego my?',
    services: [
      {
        icon: Wrench,
        title: 'Naprawa i serwis',
        description:
          'Profesjonalny serwis zegarmistrzowski. Przeglądy, regulacje, naprawy mechanizmów, wymiana części, renowacje koperty i bransolet.',
        features: ['Przeglądy okresowe', 'Naprawy mechanizmów', 'Renowacje', 'Polerowanie'],
        href: '/uslugi/naprawa-i-serwis',
      },
      {
        icon: ArrowDownToLine,
        title: 'Skup zegarków',
        description:
          'Uczciwa wycena i natychmiastowa płatność. Skupujemy zegarki premium wszystkich marek, także vintage i biżuterię.',
        features: ['Wycena gratis', 'Płatność od ręki', 'Wszystkie marki', 'Dyskrecja'],
        href: '/uslugi/skup',
      },
      {
        icon: Repeat,
        title: 'Komis',
        description:
          'Profesjonalna sprzedaż w komisie. Dotrzemy do właściwych kolekcjonerów, zadbamy o prezentację i uzyskamy najlepszą cenę.',
        features: ['Profesjonalna prezentacja', 'Szeroka sieć kontaktów', 'Transparentne warunki', 'Marketing'],
        href: '/uslugi/komis',
      },
    ],
    expertise: [
      { icon: Award, title: '15+ lat doświadczenia', description: 'Wieloletnia praktyka w serwisowaniu zegarków premium.' },
      { icon: Shield, title: 'Gwarancja na usługi', description: 'Wszystkie naprawy objęte gwarancją jakości.' },
      { icon: Clock, title: 'Indywidualne podejście', description: 'Każde zlecenie traktujemy z należytą uwagą.' },
    ],
  },
  en: {
    title: 'Expert services',
    lead:
      'A full range of services for watch owners and collectors. Every case is handled individually, with high standards and clear next steps.',
    learnMore: 'Learn more',
    why: 'Why us?',
    services: [
      {
        icon: Wrench,
        title: 'Repair and service',
        description:
          'Professional watch service: inspections, regulation, movement repairs, parts replacement, case and bracelet restoration.',
        features: ['Periodic service', 'Movement repairs', 'Restoration', 'Polishing'],
        href: '/uslugi/naprawa-i-serwis',
      },
      {
        icon: ArrowDownToLine,
        title: 'Watch buying',
        description:
          'Fair valuation and immediate payment. We buy premium watches from all major brands, including vintage pieces and jewellery.',
        features: ['Free valuation', 'Fast payment', 'All premium brands', 'Discretion'],
        href: '/uslugi/skup',
      },
      {
        icon: Repeat,
        title: 'Consignment',
        description:
          'Professional consignment sale. We reach the right collectors, handle presentation and help achieve the strongest price.',
        features: ['Professional presentation', 'Collector network', 'Transparent terms', 'Marketing'],
        href: '/uslugi/komis',
      },
    ],
    expertise: [
      { icon: Award, title: '15+ years of experience', description: 'Long-standing practice with premium watch servicing and transactions.' },
      { icon: Shield, title: 'Service warranty', description: 'Repairs are covered by our boutique quality warranty.' },
      { icon: Clock, title: 'Individual approach', description: 'Every request receives careful, case-by-case attention.' },
    ],
  },
  ua: {
    title: 'Експертні послуги',
    lead:
      'Повний спектр послуг для власників і колекціонерів годинників. Кожне звернення розглядаємо індивідуально, з високими стандартами якості.',
    learnMore: 'Дізнатися більше',
    why: 'Чому ми?',
    services: [
      {
        icon: Wrench,
        title: 'Ремонт і сервіс',
        description:
          'Професійний годинниковий сервіс: огляди, регулювання, ремонт механізмів, заміна деталей, реставрація корпусу та браслета.',
        features: ['Періодичний сервіс', 'Ремонт механізмів', 'Реставрація', 'Полірування'],
        href: '/uslugi/naprawa-i-serwis',
      },
      {
        icon: ArrowDownToLine,
        title: 'Викуп годинників',
        description:
          'Справедлива оцінка та швидка оплата. Викупляємо преміальні годинники всіх основних брендів, також вінтажні моделі й прикраси.',
        features: ['Безкоштовна оцінка', 'Швидка оплата', 'Усі преміальні бренди', 'Дискретність'],
        href: '/uslugi/skup',
      },
      {
        icon: Repeat,
        title: 'Комісія',
        description:
          'Професійний комісійний продаж. Ми знаходимо правильних колекціонерів, готуємо презентацію та допомагаємо отримати сильну ціну.',
        features: ['Професійна презентація', 'Мережа колекціонерів', 'Прозорі умови', 'Маркетинг'],
        href: '/uslugi/komis',
      },
    ],
    expertise: [
      { icon: Award, title: 'Понад 15 років досвіду', description: 'Багаторічна практика в роботі з преміальними годинниками.' },
      { icon: Shield, title: 'Гарантія на послуги', description: 'Ремонти покриваються гарантією якості бутіка.' },
      { icon: Clock, title: 'Індивідуальний підхід', description: 'Кожне звернення розглядаємо уважно та окремо.' },
    ],
  },
} as const

export function ServicesPage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = servicesOverviewCopy[locale]

  return (
    <>
      <Section spacing="md" className="pt-28 lg:pt-32">
        <Container>
          <div className="max-w-2xl">
            <Heading as="h1" size="xl">
              {t.title}
            </Heading>
            <Text variant="lead" muted className="mt-6">
              {t.lead}
            </Text>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {t.services.map((service, index) => (
              <Card
                key={index}
                variant="outlined"
                padding="lg"
                className="flex flex-col bg-background transition-all duration-500 hover:-translate-y-1 hover:border-accent-gold/30 hover:shadow-xl hover:shadow-accent-gold/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded bg-accent-gold/10">
                  <service.icon className="h-7 w-7 text-accent-gold" />
                </div>
                <h2 className="mt-6 font-serif text-2xl font-semibold">{service.title}</h2>
                <p className="mt-4 flex-1 text-muted-foreground">{service.description}</p>
                <ul className="mt-6 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-accent-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={localizePath(service.href, locale)}
                  className="mt-8 inline-flex items-center text-sm font-medium text-accent-gold transition-colors hover:text-accent-gold/80"
                >
                  {t.learnMore}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="text-center">
            <Heading as="h2" size="lg">
              {t.why}
            </Heading>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {t.expertise.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
                  <item.icon className="h-6 w-6 text-accent-gold" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

const buyingCopy = {
  pl: {
    schemaType: 'Skup zegarków premium',
    schemaDescription: 'Skup zegarków premium. Uczciwa wycena, natychmiastowa płatność, dyskrecja. Rolex, Omega, Patek Philippe i inne marki.',
    h1: 'Skup zegarków',
    lead:
      'Skupujemy zegarki premium wszystkich marek. Oferujemy uczciwe wyceny oparte na aktualnych cenach rynkowych i natychmiastową płatność.',
    benefits: [
      { icon: Banknote, title: 'Bezpłatna wycena', description: 'Realne ceny rynkowe oparte na aktualnych notowaniach i stanie zegarka - bez zobowiązań.' },
      { icon: Clock, title: 'Szybko i sprawnie', description: 'Decyzja i płatność uzgadniane indywidualnie - gotówka lub przelew.' },
      { icon: Shield, title: 'Bezpieczeństwo', description: 'Transakcja w butiku lub w bezpiecznym miejscu według Twojego wyboru.' },
      { icon: Eye, title: 'Dyskrecja', description: 'Pełna poufność transakcji. Nie udostępniamy informacji osobom trzecim.' },
    ],
    whatHeading: 'Co skupujemy',
    what: [
      'Zegarki mechaniczne wszystkich marek premium',
      'Zegarki w każdym stanie - sprawne i do naprawy',
      'Zegarki z kompletnymi lub niekompletnymi dokumentami',
      'Zegarki vintage i współczesne',
      'Biżuterię ze złota i platyny',
      'Kosztowności i kamienie szlachetne',
    ],
    brandsHeading: 'Poszukiwane marki',
    processHeading: 'Jak to działa',
    process: [
      { step: '01', title: 'Kontakt', description: 'Wyślij zdjęcia i opis zegarka. Odpowiemy ze wstępną wyceną.' },
      { step: '02', title: 'Spotkanie', description: 'Umówimy się na oględziny i przedstawimy ostateczną ofertę.' },
      { step: '03', title: 'Płatność', description: 'Jeśli akceptujesz ofertę - płatność od razu gotówką lub przelewem.' },
    ],
    formHeading: 'Wyślij zegarek do wyceny',
    formLead: 'Opisz swój zegarek - marka, model, stan, czy masz dokumenty. Możesz też dodać zdjęcia. Odpowiemy ze wstępną wyceną.',
    subject: 'Zapytanie o skup',
    submit: 'Wyślij do wyceny',
    success: 'Dziękujemy. Przeanalizujemy Twój zegarek i odpowiemy w ciągu 24 godzin.',
  },
  en: {
    schemaType: 'Premium watch buying',
    schemaDescription: 'Premium watch buying. Fair valuation, fast payment, discretion. Rolex, Omega, Patek Philippe and other brands.',
    h1: 'Watch buying',
    lead:
      'We buy premium watches from all major brands. You receive a fair market-based valuation and a clear payment route.',
    benefits: [
      { icon: Banknote, title: 'Free valuation', description: 'Real market prices based on current demand and the condition of the watch, with no obligation.' },
      { icon: Clock, title: 'Fast process', description: 'Decision and payment are agreed individually, by cash or bank transfer.' },
      { icon: Shield, title: 'Security', description: 'The transaction takes place in the boutique or another secure location agreed with you.' },
      { icon: Eye, title: 'Discretion', description: 'Full confidentiality. We do not share transaction information with third parties.' },
    ],
    whatHeading: 'What we buy',
    what: [
      'Mechanical watches from premium brands',
      'Watches in any condition, working or requiring service',
      'Watches with complete or incomplete documents',
      'Vintage and contemporary watches',
      'Gold and platinum jewellery',
      'Valuables and precious stones',
    ],
    brandsHeading: 'Brands we look for',
    processHeading: 'How it works',
    process: [
      { step: '01', title: 'Contact', description: 'Send photos and a short description. We reply with a preliminary valuation.' },
      { step: '02', title: 'Meeting', description: 'We arrange an inspection and present the final offer.' },
      { step: '03', title: 'Payment', description: 'If you accept the offer, payment is completed immediately by cash or transfer.' },
    ],
    formHeading: 'Send your watch for valuation',
    formLead: 'Describe your watch: brand, model, condition and documents. We will reply with a preliminary valuation.',
    subject: 'Watch buying enquiry',
    submit: 'Send for valuation',
    success: 'Thank you. We will review your watch and reply within 24 hours.',
  },
  ua: {
    schemaType: 'Викуп преміальних годинників',
    schemaDescription: 'Викуп преміальних годинників. Справедлива оцінка, швидка оплата, дискретність. Rolex, Omega, Patek Philippe та інші бренди.',
    h1: 'Викуп годинників',
    lead:
      'Ми викупляємо преміальні годинники всіх основних брендів. Ви отримуєте справедливу ринкову оцінку та зрозумілий спосіб оплати.',
    benefits: [
      { icon: Banknote, title: 'Безкоштовна оцінка', description: 'Реальна ринкова ціна з урахуванням попиту та стану годинника, без зобов’язань.' },
      { icon: Clock, title: 'Швидкий процес', description: 'Рішення та оплата узгоджуються індивідуально - готівкою або переказом.' },
      { icon: Shield, title: 'Безпека', description: 'Угода проходить у бутіку або в іншому безпечному місці за домовленістю.' },
      { icon: Eye, title: 'Дискретність', description: 'Повна конфіденційність. Ми не передаємо інформацію про угоду третім особам.' },
    ],
    whatHeading: 'Що ми викупляємо',
    what: [
      'Механічні годинники преміальних брендів',
      'Годинники в будь-якому стані - справні або ті, що потребують сервісу',
      'Годинники з повними або неповними документами',
      'Вінтажні та сучасні годинники',
      'Прикраси із золота та платини',
      'Коштовності та дорогоцінні камені',
    ],
    brandsHeading: 'Бренди, які шукаємо',
    processHeading: 'Як це працює',
    process: [
      { step: '01', title: 'Контакт', description: 'Надішліть фото та короткий опис. Ми відповімо з попередньою оцінкою.' },
      { step: '02', title: 'Зустріч', description: 'Домовляємося про огляд і представляємо фінальну пропозицію.' },
      { step: '03', title: 'Оплата', description: 'Якщо пропозиція підходить, оплата проходить одразу готівкою або переказом.' },
    ],
    formHeading: 'Надішліть годинник на оцінку',
    formLead: 'Опишіть годинник: бренд, модель, стан і документи. Ми відповімо з попередньою оцінкою.',
    subject: 'Запит на викуп',
    submit: 'Надіслати на оцінку',
    success: 'Дякуємо. Ми проаналізуємо годинник і відповімо протягом 24 годин.',
  },
} as const

const premiumBrands = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'IWC',
  'Jaeger-LeCoultre',
  'Cartier',
  'Breitling',
  'Tudor',
  'Panerai',
  'TAG Heuer',
  'Vacheron Constantin',
]

export function WatchBuyingServicePage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = buyingCopy[locale]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: t.schemaType,
            provider: { '@type': 'LocalBusiness', name: 'Warszawski Czas' },
            areaServed: { '@type': 'City', name: locale === 'en' ? 'Warsaw' : 'Warszawa' },
            description: t.schemaDescription,
          }),
        }}
      />
      <Section spacing="md" className="pt-28 lg:pt-32">
        <Container>
          <div className="max-w-2xl">
            <Heading as="h1" size="xl">{t.h1}</Heading>
            <Text variant="lead" muted className="mt-6">{t.lead}</Text>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {t.benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
                  <benefit.icon className="h-6 w-6 text-accent-gold" />
                </div>
                <h3 className="mt-6 font-serif text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Heading as="h2" size="md">{t.whatHeading}</Heading>
              <ul className="mt-8 space-y-4">
                {t.what.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-gold" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Heading as="h2" size="md">{t.brandsHeading}</Heading>
              <div className="mt-8 flex flex-wrap gap-3">
                {premiumBrands.map((brand) => (
                  <span key={brand} className="rounded border border-border px-4 py-2 text-sm text-muted-foreground">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <Heading as="h2" size="lg" className="text-center">{t.processHeading}</Heading>
          <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-3">
            {t.process.map((item) => (
              <div key={item.step} className="text-center">
                <span className="font-serif text-4xl font-bold text-accent-gold/30">{item.step}</span>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <Heading as="h2" size="md">{t.formHeading}</Heading>
            <Text muted className="mx-auto mt-4 max-w-lg">{t.formLead}</Text>
          </div>
          <div className="mt-12">
            <InquiryForm subject={t.subject} submitLabel={t.submit} successMessage={t.success} locale={locale} />
          </div>
        </Container>
      </Section>
    </>
  )
}

const consignmentCopy = {
  pl: {
    schemaType: 'Komis zegarków',
    schemaDescription: 'Profesjonalna sprzedaż komisowa zegarków premium. Dotrzemy do właściwych kolekcjonerów i uzyskamy najlepszą cenę.',
    h1: 'Komis zegarków',
    lead:
      'Profesjonalna sprzedaż komisowa dla właścicieli zegarków premium. Dotrzemy do właściwych kupujących i uzyskamy najlepszą cenę za Twój egzemplarz.',
    benefits: [
      { icon: Users, title: 'Sieć kontaktów', description: 'Dostęp do szerokiej sieci kolekcjonerów i dealerów w Polsce i za granicą.' },
      { icon: Camera, title: 'Profesjonalna prezentacja', description: 'Wysokiej jakości zdjęcia i opisy, które przyciągają poważnych kupujących.' },
      { icon: TrendingUp, title: 'Optymalna cena', description: 'Znajomość rynku pozwala uzyskać najlepszą możliwą cenę za Twój zegarek.' },
      { icon: Shield, title: 'Bezpieczeństwo', description: 'Zegarek pozostaje ubezpieczony i zabezpieczony przez cały proces sprzedaży.' },
    ],
    whyHeading: 'Dlaczego komis?',
    whyLead: 'Sprzedaż komisowa to najlepsza opcja, gdy zależy Ci na uzyskaniu najwyższej ceny i nie spieszysz się z transakcją.',
    why: [
      'Uzyskasz wyższą cenę niż przy natychmiastowej sprzedaży',
      'Nie musisz zajmować się sprzedażą i negocjacjami',
      'Dotrzemy do kolekcjonerów, do których sam nie dotrzesz',
      'Twój zegarek jest bezpieczny i ubezpieczony',
      'Profesjonalna prezentacja zwiększa wartość postrzeganą',
      'Transparentne warunki - wiesz dokładnie, ile otrzymasz',
    ],
    termsHeading: 'Warunki współpracy',
    termsP1:
      'Każdy egzemplarz traktujemy indywidualnie. Warunki - prowizję, czas trwania komisu i sposób rozliczenia - ustalamy z właścicielem zegarka po oględzinach, w zależności od wartości i rodzaju modelu.',
    termsP2: 'Przez cały okres komisu zegarek pozostaje pod naszą opieką w butiku.',
    processHeading: 'Jak to działa',
    process: [
      { step: '01', title: 'Przyjęcie zegarka', description: 'Oględziny, wycena, ustalenie ceny oczekiwanej i warunków komisowych.' },
      { step: '02', title: 'Dokumentacja', description: 'Profesjonalne zdjęcia, szczegółowy opis, przygotowanie materiałów.' },
      { step: '03', title: 'Promocja', description: 'Aktywna promocja wśród naszej sieci kontaktów i w mediach branżowych.' },
      { step: '04', title: 'Negocjacje', description: 'Prowadzenie rozmów z potencjalnymi kupującymi, negocjacje ceny.' },
      { step: '05', title: 'Finalizacja', description: 'Bezpieczna transakcja i przekazanie środków na Twoje konto.' },
    ],
    formHeading: 'Zgłoś zegarek do komisu',
    formLead: 'Opisz swój zegarek i oczekiwania cenowe. Skontaktujemy się, aby omówić szczegóły i warunki współpracy.',
    subject: 'Zgłoszenie do komisu',
    submit: 'Wyślij zgłoszenie',
    success: 'Dziękujemy za zgłoszenie. Skontaktujemy się w ciągu 24 godzin.',
  },
  en: {
    schemaType: 'Watch consignment',
    schemaDescription: 'Professional consignment sale of premium watches. We reach the right collectors and help achieve the best price.',
    h1: 'Watch consignment',
    lead:
      'Professional consignment sale for owners of premium watches. We reach the right buyers and help achieve the strongest price for your piece.',
    benefits: [
      { icon: Users, title: 'Collector network', description: 'Access to a broad network of collectors and dealers in Poland and abroad.' },
      { icon: Camera, title: 'Professional presentation', description: 'High-quality photography and descriptions that attract serious buyers.' },
      { icon: TrendingUp, title: 'Optimal price', description: 'Market knowledge helps us achieve the strongest realistic price for your watch.' },
      { icon: Shield, title: 'Security', description: 'The watch remains insured and secured throughout the sale process.' },
    ],
    whyHeading: 'Why consignment?',
    whyLead: 'Consignment is the right route when you want a higher retail price and do not need an immediate transaction.',
    why: [
      'You can achieve a higher price than in an immediate buyout',
      'You do not need to handle selling or negotiations',
      'We reach collectors you would not reach on your own',
      'Your watch remains secure and insured',
      'Professional presentation improves perceived value',
      'Transparent terms - you know exactly what you receive',
    ],
    termsHeading: 'Cooperation terms',
    termsP1:
      'Every piece is handled individually. Commission, consignment duration and settlement method are agreed with the owner after inspection, depending on the value and type of model.',
    termsP2: 'Throughout the consignment period, the watch remains under our care in the boutique.',
    processHeading: 'How it works',
    process: [
      { step: '01', title: 'Watch intake', description: 'Inspection, valuation, expected price and consignment terms.' },
      { step: '02', title: 'Documentation', description: 'Professional photos, detailed description and sales materials.' },
      { step: '03', title: 'Promotion', description: 'Active presentation through our network and specialist channels.' },
      { step: '04', title: 'Negotiation', description: 'We handle conversations with potential buyers and negotiate the price.' },
      { step: '05', title: 'Finalisation', description: 'Secure transaction and transfer of funds to your account.' },
    ],
    formHeading: 'Submit a watch for consignment',
    formLead: 'Describe your watch and price expectations. We will contact you to discuss details and cooperation terms.',
    subject: 'Consignment submission',
    submit: 'Send submission',
    success: 'Thank you for the submission. We will contact you within 24 hours.',
  },
  ua: {
    schemaType: 'Комісія годинників',
    schemaDescription: 'Професійний комісійний продаж преміальних годинників. Ми знаходимо правильних колекціонерів і допомагаємо отримати найкращу ціну.',
    h1: 'Комісія годинників',
    lead:
      'Професійний комісійний продаж для власників преміальних годинників. Ми знаходимо правильних покупців і допомагаємо отримати сильну ціну.',
    benefits: [
      { icon: Users, title: 'Мережа контактів', description: 'Доступ до широкої мережі колекціонерів і дилерів у Польщі та за кордоном.' },
      { icon: Camera, title: 'Професійна презентація', description: 'Якісні фото й описи, які привертають увагу серйозних покупців.' },
      { icon: TrendingUp, title: 'Оптимальна ціна', description: 'Знання ринку допомагає отримати найсильнішу реалістичну ціну.' },
      { icon: Shield, title: 'Безпека', description: 'Годинник залишається застрахованим і захищеним протягом усього процесу продажу.' },
    ],
    whyHeading: 'Чому комісія?',
    whyLead: 'Комісійний продаж підходить, коли ви хочете вищу роздрібну ціну й не поспішаєте з угодою.',
    why: [
      'Можна отримати вищу ціну, ніж при негайному викупі',
      'Вам не потрібно займатися продажем і переговорами',
      'Ми доходимо до колекціонерів, яких складно знайти самостійно',
      'Ваш годинник захищений і застрахований',
      'Професійна презентація підвищує сприйняту цінність',
      'Прозорі умови - ви точно знаєте, скільки отримаєте',
    ],
    termsHeading: 'Умови співпраці',
    termsP1:
      'Кожен екземпляр розглядаємо індивідуально. Комісію, тривалість продажу та спосіб розрахунку узгоджуємо з власником після огляду, залежно від вартості й типу моделі.',
    termsP2: 'Протягом усього періоду комісії годинник залишається під нашою опікою в бутіку.',
    processHeading: 'Як це працює',
    process: [
      { step: '01', title: 'Прийом годинника', description: 'Огляд, оцінка, очікувана ціна та умови комісії.' },
      { step: '02', title: 'Документація', description: 'Професійні фото, детальний опис і матеріали для продажу.' },
      { step: '03', title: 'Просування', description: 'Активна презентація через нашу мережу та профільні канали.' },
      { step: '04', title: 'Переговори', description: 'Ми ведемо розмови з потенційними покупцями та погоджуємо ціну.' },
      { step: '05', title: 'Фіналізація', description: 'Безпечна угода та переказ коштів на ваш рахунок.' },
    ],
    formHeading: 'Подати годинник на комісію',
    formLead: 'Опишіть годинник і цінові очікування. Ми зв’яжемося, щоб обговорити деталі та умови співпраці.',
    subject: 'Подання на комісію',
    submit: 'Надіслати заявку',
    success: 'Дякуємо за заявку. Ми зв’яжемося з вами протягом 24 годин.',
  },
} as const

export function ConsignmentServicePage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = consignmentCopy[locale]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: t.schemaType,
            provider: { '@type': 'LocalBusiness', name: 'Warszawski Czas' },
            areaServed: { '@type': 'City', name: locale === 'en' ? 'Warsaw' : 'Warszawa' },
            description: t.schemaDescription,
          }),
        }}
      />
      <Section spacing="md" className="pt-28 lg:pt-32">
        <Container>
          <div className="max-w-2xl">
            <Heading as="h1" size="xl">{t.h1}</Heading>
            <Text variant="lead" muted className="mt-6">{t.lead}</Text>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {t.benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
                  <benefit.icon className="h-6 w-6 text-accent-gold" />
                </div>
                <h3 className="mt-6 font-serif text-lg font-semibold">{benefit.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <Heading as="h2" size="md">{t.whyHeading}</Heading>
              <Text muted className="mt-4">{t.whyLead}</Text>
              <ul className="mt-8 space-y-4">
                {t.why.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-gold" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card variant="outlined" padding="lg">
              <h3 className="font-serif text-xl font-semibold">{t.termsHeading}</h3>
              <p className="mt-6 text-sm text-muted-foreground">{t.termsP1}</p>
              <p className="mt-4 text-sm text-muted-foreground">{t.termsP2}</p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <Heading as="h2" size="lg" className="text-center">{t.processHeading}</Heading>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-5">
            {t.process.map((item) => (
              <div key={item.step} className="text-center">
                <span className="font-serif text-3xl font-bold text-accent-gold/30">{item.step}</span>
                <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <Heading as="h2" size="md">{t.formHeading}</Heading>
            <Text muted className="mx-auto mt-4 max-w-lg">{t.formLead}</Text>
          </div>
          <div className="mt-12">
            <InquiryForm subject={t.subject} submitLabel={t.submit} successMessage={t.success} locale={locale} />
          </div>
        </Container>
      </Section>
    </>
  )
}

const repairCopy = {
  pl: {
    schemaType: 'Naprawa i serwis zegarków',
    schemaDescription: 'Profesjonalny serwis zegarmistrzowski. Przeglądy, naprawy, regulacje, renowacje zegarków mechanicznych wszystkich marek.',
    h1: 'Naprawa i serwis',
    lead:
      'Profesjonalny serwis zegarmistrzowski z wieloletnim doświadczeniem. Serwisujemy zegarki mechaniczne wszystkich marek - od przeglądu okresowego po skomplikowane naprawy.',
    servicesHeading: 'Zakres usług',
    services: [
      { title: 'Przegląd okresowy', description: 'Kompleksowy przegląd mechanizmu, czyszczenie, smarowanie, regulacja chodu, test wodoszczelności.' },
      { title: 'Naprawa mechanizmu', description: 'Diagnoza i naprawa uszkodzeń mechanicznych, wymiana zużytych części, odbudowa komplikacji.' },
      { title: 'Wymiana części', description: 'Wymiana szkieł, koronek, uszczelek, sprężyn, wskazówek. Oryginalne części lub wysokiej jakości zamienniki.' },
      { title: 'Renowacja', description: 'Profesjonalne polerowanie koperty i bransolety, renowacja tarcz, odświeżanie wyglądu.' },
      { title: 'Regulacja chodu', description: 'Precyzyjna regulacja mechanizmu na pozycjomierzu elektronicznym dla optymalnej dokładności.' },
      { title: 'Test wodoszczelności', description: 'Profesjonalny test szczelności i wymiana uszczelek dla przywrócenia wodoodporności.' },
    ],
    processHeading: 'Jak pracujemy',
    process: [
      { step: '01', title: 'Przyjęcie zlecenia', description: 'Oględziny zegarka, omówienie potrzeb, wstępna wycena.' },
      { step: '02', title: 'Diagnoza', description: 'Szczegółowa analiza mechanizmu i stanu technicznego.' },
      { step: '03', title: 'Wycena i akceptacja', description: 'Dokładna wycena i uzgodnienie zakresu prac.' },
      { step: '04', title: 'Realizacja', description: 'Profesjonalne wykonanie zleconych prac.' },
      { step: '05', title: 'Kontrola jakości', description: 'Testy funkcjonalne i wizualna kontrola.' },
      { step: '06', title: 'Odbiór', description: 'Przekazanie zegarka z gwarancją na usługę.' },
    ],
    formHeading: 'Umów serwis',
    formLead: 'Opisz problem lub rodzaj serwisu, którego potrzebujesz. Skontaktujemy się, aby ustalić szczegóły.',
    subject: 'Zapytanie o serwis',
    submit: 'Wyślij zapytanie',
    success: 'Dziękujemy. Skontaktujemy się w ciągu 24 godzin.',
  },
  en: {
    schemaType: 'Watch repair and service',
    schemaDescription: 'Professional watch service: inspections, repairs, regulation and restoration for mechanical watches from premium brands.',
    h1: 'Repair and service',
    lead:
      'Professional watchmaking service with long-standing experience. We service mechanical watches from all major brands, from periodic inspections to complex repairs.',
    servicesHeading: 'Scope of service',
    services: [
      { title: 'Periodic service', description: 'Complete movement inspection, cleaning, lubrication, regulation and water-resistance testing.' },
      { title: 'Movement repair', description: 'Diagnosis and repair of mechanical faults, replacement of worn parts and restoration of complications.' },
      { title: 'Parts replacement', description: 'Replacement of crystals, crowns, gaskets, springs and hands using original or high-quality replacement parts.' },
      { title: 'Restoration', description: 'Professional case and bracelet polishing, dial restoration and visual refresh.' },
      { title: 'Rate regulation', description: 'Precise movement regulation on electronic timing equipment for optimal accuracy.' },
      { title: 'Water-resistance test', description: 'Professional pressure testing and gasket replacement to restore water resistance.' },
    ],
    processHeading: 'How we work',
    process: [
      { step: '01', title: 'Intake', description: 'Watch inspection, needs assessment and preliminary estimate.' },
      { step: '02', title: 'Diagnosis', description: 'Detailed analysis of the movement and technical condition.' },
      { step: '03', title: 'Quote and approval', description: 'Exact estimate and agreement on the scope of work.' },
      { step: '04', title: 'Service work', description: 'Professional execution of the agreed work.' },
      { step: '05', title: 'Quality control', description: 'Functional tests and visual control.' },
      { step: '06', title: 'Collection', description: 'Watch handover with boutique service warranty.' },
    ],
    formHeading: 'Book a service',
    formLead: 'Describe the problem or type of service you need. We will contact you to arrange the details.',
    subject: 'Service enquiry',
    submit: 'Send enquiry',
    success: 'Thank you. We will contact you within 24 hours.',
  },
  ua: {
    schemaType: 'Ремонт і сервіс годинників',
    schemaDescription: 'Професійний годинниковий сервіс: огляди, ремонт, регулювання та реставрація механічних годинників преміальних брендів.',
    h1: 'Ремонт і сервіс',
    lead:
      'Професійний годинниковий сервіс із багаторічним досвідом. Обслуговуємо механічні годинники всіх основних брендів - від періодичного огляду до складних ремонтів.',
    servicesHeading: 'Обсяг послуг',
    services: [
      { title: 'Періодичний сервіс', description: 'Комплексний огляд механізму, очищення, змащення, регулювання ходу та тест водозахисту.' },
      { title: 'Ремонт механізму', description: 'Діагностика й ремонт механічних пошкоджень, заміна зношених деталей, відновлення ускладнень.' },
      { title: 'Заміна деталей', description: 'Заміна скла, коронок, прокладок, пружин і стрілок з використанням оригінальних або якісних деталей.' },
      { title: 'Реставрація', description: 'Професійне полірування корпусу й браслета, реставрація циферблата та оновлення зовнішнього вигляду.' },
      { title: 'Регулювання ходу', description: 'Точне регулювання механізму на електронному обладнанні для оптимальної точності.' },
      { title: 'Тест водозахисту', description: 'Професійне тестування герметичності та заміна прокладок для відновлення водозахисту.' },
    ],
    processHeading: 'Як ми працюємо',
    process: [
      { step: '01', title: 'Прийом', description: 'Огляд годинника, обговорення потреб і попередня оцінка.' },
      { step: '02', title: 'Діагностика', description: 'Детальний аналіз механізму та технічного стану.' },
      { step: '03', title: 'Кошторис і згода', description: 'Точна оцінка та погодження обсягу робіт.' },
      { step: '04', title: 'Виконання', description: 'Професійне виконання погоджених робіт.' },
      { step: '05', title: 'Контроль якості', description: 'Функціональні тести та візуальний контроль.' },
      { step: '06', title: 'Видача', description: 'Передача годинника з гарантією бутіка на послугу.' },
    ],
    formHeading: 'Записатися на сервіс',
    formLead: 'Опишіть проблему або тип сервісу, який потрібен. Ми зв’яжемося, щоб узгодити деталі.',
    subject: 'Запит на сервіс',
    submit: 'Надіслати запит',
    success: 'Дякуємо. Ми зв’яжемося з вами протягом 24 годин.',
  },
} as const

export function RepairServicePage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = repairCopy[locale]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: t.schemaType,
            provider: { '@type': 'LocalBusiness', name: 'Warszawski Czas' },
            areaServed: { '@type': 'City', name: locale === 'en' ? 'Warsaw' : 'Warszawa' },
            description: t.schemaDescription,
          }),
        }}
      />
      <Section spacing="md" className="pt-28 lg:pt-32">
        <Container>
          <div className="max-w-2xl">
            <Heading as="h1" size="xl">{t.h1}</Heading>
            <Text variant="lead" muted className="mt-6">{t.lead}</Text>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <Heading as="h2" size="lg" className="text-center">{t.servicesHeading}</Heading>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {t.services.map((service) => (
              <Card key={service.title} variant="outlined" padding="md" className="bg-background">
                <h3 className="font-serif text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <Heading as="h2" size="lg" className="text-center">{t.processHeading}</Heading>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.process.map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="font-serif text-3xl font-bold text-accent-gold/20">{item.step}</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container size="narrow">
          <div className="text-center">
            <Heading as="h2" size="md">{t.formHeading}</Heading>
            <Text muted className="mx-auto mt-4 max-w-lg">{t.formLead}</Text>
          </div>
          <div className="mt-12">
            <InquiryForm subject={t.subject} submitLabel={t.submit} successMessage={t.success} locale={locale} />
          </div>
        </Container>
      </Section>
    </>
  )
}
