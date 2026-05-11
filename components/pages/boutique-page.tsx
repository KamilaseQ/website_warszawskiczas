import Image from 'next/image'
import { ArrowUpRight, Clock, MapPin, Train } from 'lucide-react'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, LocationMap } from '@/components/ui'
import { CONTACT_PHONE, CONTACT_PHONE_RAW } from '@/lib/config'
import type { Locale } from '@/lib/i18n'

const JAREK_PHONE = '+48 604 312 411'
const JAREK_PHONE_RAW = '+48604312411'
const JAREK_EMAIL = 'jarexzegarex@gmail.com'

const copy = {
  pl: {
    heroEyebrow: 'Butik',
    heroTitleA: 'Warszawa',
    heroTitleB: 'w detalach',
    heroLead:
      'Mokotowska 71 - kameralna przestrzeń dla kolekcjonerów zegarków premium w sercu warszawskiego Śródmieścia.',
    heroAddress: 'ul. Mokotowska 71 · 00-530 Warszawa',
    atmosphere: 'Atmosfera',
    atmosphereText:
      'Warszawski Czas powstał z przekonania, że zakup wyjątkowego zegarka powinien być doświadczeniem, nie transakcją. Tworzyliśmy przestrzeń, w której czas płynie wolniej - od dyskretnej witryny po rozmowę przy kawie nad mechanizmem.',
    atmosphereP1:
      'Lokalizacja na Mokotowskiej nie jest przypadkiem. Ulica łączy prestiż międzywojennej Warszawy z dyskrecją współczesnych galerii - to ten sam ton, który chcieliśmy dać butikowi.',
    atmosphereP2:
      'W Warszawskim Czasie nie jesteś klientem - jesteś gościem. Wierzymy, że właściwy zegarek sam znajdzie swojego właściciela, jeżeli tylko damy mu odpowiednią przestrzeń i ciszę.',
    experience: 'Doświadczenie wizyty',
    quote:
      'Wizyta tu nie ma scenariusza. Pijemy kawę, rozmawiamy o mechanice, a zegarki same wchodzą w światło, kiedy znajdują swój moment.',
    visitItems: [
      'Indywidualna konsultacja z ekspertem',
      'Prezentacja wybranych egzemplarzy',
      'Możliwość przymierzenia zegarków',
      'Profesjonalne doradztwo bez presji',
      'Kawa lub herbata w spokojnej atmosferze',
      'Bezpłatna wycena posiadanego zegarka',
    ],
    bookVisit: 'Umów wizytę',
    founder: 'Założyciel',
    founderRole: 'Założyciel · Kurator kolekcji',
    founderP1:
      'Pasjonat zegarmistrzostwa od ponad dwóch dekad. Założył butik na Mokotowskiej, by stworzyć miejsce, gdzie czas poświęcony klientowi liczy się tak samo jak ten odmierzany przez mechanizm.',
    founderP2:
      'Każdy egzemplarz w katalogu przechodzi przez jego ręce - od pierwszej weryfikacji po rozmowę z nowym właścicielem.',
    privateContact: 'Kontakt prywatny',
    practical: 'Praktycznie',
    practicalTitleA: 'Adres',
    practicalTitleB: 'i godziny',
    practicalLead: 'Zarezerwuj wizytę telefonicznie lub wpadnij w godzinach butiku - drzwi są otwarte.',
    address: 'Adres',
    hours: 'Godziny',
    weekdays: 'Pon - Pt',
    saturday: 'Sobota',
    transit: 'Dojazd',
    contact: 'Kontakt',
    phoneLabel: 'Telefon',
    emailLabel: 'Email',
    instagramLabel: 'Instagram',
    imageAltMain: 'Butik Warszawski Czas - Mokotowska 71',
    imageAltStreet: 'Witryna i fasada butiku - Mokotowska 71',
    imageAltInterior: 'Wnętrze butiku Warszawski Czas - gabloty',
    imageAltSignature: 'Witryna butiku - sygnatura miejsca',
    imageAltFounder: 'Jarek Jarosz - założyciel Warszawski Czas',
  },
  en: {
    heroEyebrow: 'Boutique',
    heroTitleA: 'Warsaw',
    heroTitleB: 'in detail',
    heroLead:
      'Mokotowska 71 - an intimate space for premium watch collectors in the heart of central Warsaw.',
    heroAddress: 'ul. Mokotowska 71 · 00-530 Warsaw',
    atmosphere: 'Atmosphere',
    atmosphereText:
      'Warszawski Czas was created from the belief that buying an exceptional watch should be an experience, not a transaction. We built a space where time slows down - from the discreet storefront to a conversation over coffee and a movement.',
    atmosphereP1:
      'The Mokotowska location is deliberate. The street combines the prestige of interwar Warsaw with the discretion of contemporary galleries - the same tone we wanted for the boutique.',
    atmosphereP2:
      'At Warszawski Czas, you are not just a client - you are a guest. We believe the right watch finds its owner when it is given enough space and quiet.',
    experience: 'Visit experience',
    quote:
      'There is no script for a visit here. We drink coffee, talk about mechanics, and the watches find their own light when the moment is right.',
    visitItems: [
      'Individual consultation with an expert',
      'Presentation of selected pieces',
      'Opportunity to try watches on',
      'Professional advice without pressure',
      'Coffee or tea in a calm atmosphere',
      'Free valuation of your watch',
    ],
    bookVisit: 'Book a visit',
    founder: 'Founder',
    founderRole: 'Founder · Collection curator',
    founderP1:
      'A watchmaking enthusiast for more than two decades. He founded the boutique on Mokotowska to create a place where the time devoted to the client matters as much as the time measured by the movement.',
    founderP2:
      'Every piece in the catalogue passes through his hands - from first verification to the conversation with its new owner.',
    privateContact: 'Private contact',
    practical: 'Practical',
    practicalTitleA: 'Address',
    practicalTitleB: 'and hours',
    practicalLead: 'Book a visit by phone or come during boutique hours - the door is open.',
    address: 'Address',
    hours: 'Hours',
    weekdays: 'Mon - Fri',
    saturday: 'Saturday',
    transit: 'Getting here',
    contact: 'Contact',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    instagramLabel: 'Instagram',
    imageAltMain: 'Warszawski Czas boutique - Mokotowska 71',
    imageAltStreet: 'Boutique storefront and facade - Mokotowska 71',
    imageAltInterior: 'Warszawski Czas boutique interior and showcases',
    imageAltSignature: 'Boutique storefront - place signature',
    imageAltFounder: 'Jarek Jarosz - founder of Warszawski Czas',
  },
  ua: {
    heroEyebrow: 'Бутік',
    heroTitleA: 'Варшава',
    heroTitleB: 'у деталях',
    heroLead:
      'Mokotowska 71 - камерний простір для колекціонерів преміальних годинників у серці варшавського центру.',
    heroAddress: 'ul. Mokotowska 71 · 00-530 Warszawa',
    atmosphere: 'Атмосфера',
    atmosphereText:
      'Warszawski Czas виник із переконання, що купівля виняткового годинника має бути досвідом, а не просто транзакцією. Ми створили простір, де час сповільнюється - від дискретної вітрини до розмови за кавою про механізм.',
    atmosphereP1:
      'Локація на Mokotowska не випадкова. Вулиця поєднує престиж міжвоєнної Варшави з дискретністю сучасних галерей - саме такий тон ми хотіли надати бутіку.',
    atmosphereP2:
      'У Warszawski Czas ви не просто клієнт - ви гість. Ми віримо, що правильний годинник сам знаходить власника, якщо дати йому простір і тишу.',
    experience: 'Досвід візиту',
    quote:
      'Візит тут не має сценарію. Ми п’ємо каву, говоримо про механіку, а годинники самі входять у світло, коли знаходять свій момент.',
    visitItems: [
      'Індивідуальна консультація з експертом',
      'Презентація вибраних екземплярів',
      'Можливість приміряти годинники',
      'Професійна порада без тиску',
      'Кава або чай у спокійній атмосфері',
      'Безкоштовна оцінка вашого годинника',
    ],
    bookVisit: 'Записатися на візит',
    founder: 'Засновник',
    founderRole: 'Засновник · Куратор колекції',
    founderP1:
      'Ентузіаст годинникової справи вже понад два десятиліття. Він заснував бутік на Mokotowska, щоб створити місце, де час, присвячений клієнту, важить так само, як час, який відмірює механізм.',
    founderP2:
      'Кожен екземпляр у каталозі проходить через його руки - від першої перевірки до розмови з новим власником.',
    privateContact: 'Приватний контакт',
    practical: 'Практично',
    practicalTitleA: 'Адреса',
    practicalTitleB: 'і години',
    practicalLead: 'Забронюйте візит телефоном або приходьте в години роботи бутіка - двері відчинені.',
    address: 'Адреса',
    hours: 'Години',
    weekdays: 'Пн - Пт',
    saturday: 'Субота',
    transit: 'Як дістатися',
    contact: 'Контакт',
    phoneLabel: 'Телефон',
    emailLabel: 'Email',
    instagramLabel: 'Instagram',
    imageAltMain: 'Бутік Warszawski Czas - Mokotowska 71',
    imageAltStreet: 'Вітрина та фасад бутіка - Mokotowska 71',
    imageAltInterior: 'Інтер’єр бутіка Warszawski Czas і вітрини',
    imageAltSignature: 'Вітрина бутіка - підпис місця',
    imageAltFounder: 'Jarek Jarosz - засновник Warszawski Czas',
  },
} as const

function SocialIcon({ kind }: { kind: 'instagram' | 'email' | 'phone' }) {
  switch (kind) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'email':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      )
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4.5H8L9.5 8L7.6 9.4C8.5 11.5 10.5 13.5 12.6 14.4L14 12.5L17.5 14V17C17.5 18.1 16.6 19 15.5 19C9.7 18.7 5.3 14.3 5 8.5C5 7.4 5.9 6.5 5 4.5Z" />
        </svg>
      )
  }
}

export function BoutiquePage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = copy[locale]
  const socials = [
    { kind: 'instagram' as const, label: t.instagramLabel, handle: '@jarekjarosz_', href: 'https://instagram.com/jarekjarosz_' },
    { kind: 'phone' as const, label: t.phoneLabel, handle: JAREK_PHONE, href: `tel:${JAREK_PHONE_RAW}` },
    { kind: 'email' as const, label: t.emailLabel, handle: JAREK_EMAIL, href: `mailto:${JAREK_EMAIL}` },
  ]

  return (
    <>
      <section className="relative isolate min-h-screen w-full overflow-hidden bg-[#050403] text-white">
        <div className="absolute inset-0">
          <Image
            src="/butikmain.jpg"
            alt={t.imageAltMain}
            fill
            priority
            sizes="100vw"
            className="object-cover [filter:brightness(0.85)_contrast(1.06)_saturate(0.88)_sepia(0.1)]"
            style={{ objectPosition: '50% 45%' }}
          />
          <div className="absolute inset-0 bg-[#050403]/15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(201,169,98,0.14)_0%,transparent_55%)] mix-blend-screen" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#050403]/85 via-[#050403]/35 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[88rem] flex-col justify-end px-6 pb-20 pt-40 lg:px-12 lg:pb-28 lg:pt-44">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.55em] text-accent-gold">
            {t.heroEyebrow}
          </span>
          <h1 className="mt-6 max-w-4xl font-serif text-[clamp(3rem,9vw,8rem)] font-medium leading-[0.92] tracking-normal text-white">
            {t.heroTitleA}
            <br />
            <span className="font-normal italic text-white/85">{t.heroTitleB}</span>
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-white/70 sm:text-lg">
            {t.heroLead}
          </p>
          <div className="mt-10 font-sans text-[10px] uppercase tracking-[0.4em] text-white/55">
            {t.heroAddress}
          </div>
        </div>
      </section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-3">
              <p className="sticky top-32 font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                {t.atmosphere}
              </p>
            </div>
            <div className="lg:col-span-9">
              <p className="font-serif text-2xl leading-[1.45] text-foreground sm:text-3xl">
                <span className="float-left mr-3 mt-1 font-serif text-[5.5rem] leading-[0.85] text-accent-gold">
                  {t.atmosphereText.charAt(0)}
                </span>
                {t.atmosphereText.slice(1)}
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <p className="font-sans text-base leading-relaxed text-muted-foreground text-pretty">{t.atmosphereP1}</p>
                <p className="font-sans text-base leading-relaxed text-muted-foreground text-pretty">{t.atmosphereP2}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 lg:col-start-1">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/butik1.webp"
                  alt={t.imageAltStreet}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-7">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                {t.experience}
              </p>
              <blockquote className="mt-6 font-serif text-3xl italic leading-[1.2] text-foreground/85 sm:text-4xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {t.visitItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-t border-border pt-3">
                    <span className="mt-2 h-1 w-1 flex-shrink-0 bg-accent-gold" />
                    <span className="font-sans text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <ContactLink
                  source="butik"
                  className="group inline-flex items-center gap-3 border-b border-foreground/20 pb-2 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:border-accent-gold hover:text-accent-gold"
                >
                  {t.bookVisit}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </ContactLink>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-10">
            <div className="relative aspect-[5/4] w-full overflow-hidden lg:col-span-7">
              <Image src="/butik2.webp" alt={t.imageAltInterior} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden lg:col-span-5 lg:aspect-auto">
              <Image src="/butik3.webp" alt={t.imageAltSignature} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="muted" spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image src="/edek.webp" alt={t.imageAltFounder} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                {t.founder}
              </p>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1] tracking-normal text-foreground sm:text-5xl">
                Jarek Jarosz
              </h2>
              <p className="mt-2 font-serif text-lg italic text-muted-foreground">{t.founderRole}</p>

              <div className="mt-6 h-px w-12 bg-accent-gold" />

              <p className="mt-6 font-sans text-base leading-relaxed text-foreground/85 text-pretty">{t.founderP1}</p>
              <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground text-pretty">{t.founderP2}</p>

              <div className="mt-10">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/70">
                  {t.privateContact}
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {socials.map((s) => (
                    <li key={s.kind}>
                      <a
                        href={s.href}
                        target={s.href.startsWith('http') ? '_blank' : undefined}
                        rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group flex items-center gap-4 border border-foreground/10 bg-background px-4 py-3 transition-all duration-300 hover:border-accent-gold/50 hover:bg-background/70"
                      >
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-accent-gold/40 text-accent-gold transition-colors duration-300 group-hover:bg-accent-gold group-hover:text-[#0a0a0a]">
                          <span className="block h-4 w-4">
                            <SocialIcon kind={s.kind} />
                          </span>
                        </span>
                        <span className="flex flex-1 flex-col">
                          <span className="font-sans text-[9px] font-bold uppercase tracking-[0.35em] text-muted-foreground/70">
                            {s.label}
                          </span>
                          <span className="font-serif text-sm text-foreground transition-colors duration-300 group-hover:text-accent-gold">
                            {s.handle}
                          </span>
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-gold" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                {t.practical}
              </p>
              <h2 className="mt-4 font-serif text-3xl font-medium leading-[1.05] tracking-normal sm:text-4xl">
                {t.practicalTitleA}<br />
                <span className="font-normal italic">{t.practicalTitleB}</span>
              </h2>
              <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground text-pretty">
                {t.practicalLead}
              </p>
            </div>

            <div className="lg:col-span-8">
              <dl className="grid gap-y-8 sm:grid-cols-2 sm:gap-x-12">
                <div className="flex items-start gap-4 border-t border-border pt-6">
                  <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-accent-gold" strokeWidth={1.4} />
                  <div>
                    <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground/70">{t.address}</dt>
                    <dd className="mt-2 font-serif text-lg leading-snug text-foreground">
                      ul. Mokotowska 71<br />
                      <span className="text-muted-foreground">00-530 Warszawa</span>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-border pt-6">
                  <Clock className="mt-1 h-4 w-4 flex-shrink-0 text-accent-gold" strokeWidth={1.4} />
                  <div>
                    <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground/70">{t.hours}</dt>
                    <dd className="mt-2 font-serif text-base leading-relaxed text-foreground">
                      {t.weekdays} &nbsp;·&nbsp; 11:00 - 18:00
                      <br />
                      <span className="text-muted-foreground">{t.saturday} · 11:00 - 14:00</span>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-border pt-6">
                  <Train className="mt-1 h-4 w-4 flex-shrink-0 text-accent-gold" strokeWidth={1.4} />
                  <div>
                    <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground/70">{t.transit}</dt>
                    <dd className="mt-2 font-serif text-base leading-relaxed text-foreground">
                      Metro Politechnika
                      <br />
                      <span className="text-muted-foreground">Tramwaje 10 · 14 · 15</span>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4 border-t border-border pt-6">
                  <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-accent-gold" strokeWidth={1.4} />
                  <div>
                    <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground/70">{t.contact}</dt>
                    <dd className="mt-2 font-serif text-base leading-relaxed text-foreground">
                      <a href={`tel:${CONTACT_PHONE_RAW}`} className="transition-colors hover:text-accent-gold">
                        {CONTACT_PHONE}
                      </a>
                      <br />
                      <a href="mailto:biuro@warszawskiczas.pl" className="text-muted-foreground transition-colors hover:text-accent-gold">
                        biuro@warszawskiczas.pl
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <section className="relative w-full overflow-hidden">
        <LocationMap className="aspect-[3/2] w-full sm:aspect-[21/9]" />
      </section>
    </>
  )
}
