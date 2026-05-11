import Link from 'next/link'
import { Container, Heading, Section, Text } from '@/components/ui'
import { ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_RAW } from '@/lib/config'
import { localizePath, type Locale } from '@/lib/i18n'

const LAST_UPDATED = '2026-05-10'

const copy = {
  pl: {
    eyebrow: 'Dokument prawny',
    title: 'Deklaracja dostępności',
    updated: 'Ostatnia aktualizacja:',
    commitment: 'Zobowiązanie',
    commitmentText:
      'Butik Warszawski Czas dokłada starań, aby strona warszawskiczas.pl była dostępna dla wszystkich użytkowników, zgodnie z wytycznymi Web Content Accessibility Guidelines (WCAG) 2.2 na poziomie AA oraz wymaganiami European Accessibility Act.',
    status: 'Status zgodności',
    statusText:
      'Serwis jest częściowo zgodny z WCAG 2.2 AA. Pracujemy nad ciągłym usprawnianiem dostępności i naprawą zgłaszanych barier.',
    reporting: 'Zgłaszanie problemów z dostępnością',
    reportingText:
      'Jeśli napotkasz barierę dostępności na naszej stronie, daj nam znać - odpowiemy najszybciej, jak to możliwe. Każde zgłoszenie traktujemy jako priorytet.',
    contactForm: 'Formularz kontaktowy:',
    phone: 'Telefon:',
    address: 'Adres butiku',
    appeal: 'Procedura odwoławcza',
    appealText: 'Jeśli odpowiedź na zgłoszenie będzie niesatysfakcjonująca, możesz skierować skargę do Rzecznika Praw Obywatelskich:',
  },
  en: {
    eyebrow: 'Legal document',
    title: 'Accessibility statement',
    updated: 'Last updated:',
    commitment: 'Commitment',
    commitmentText:
      'Warszawski Czas boutique makes every effort to ensure that warszawskiczas.pl is accessible to all users, in line with WCAG 2.2 AA guidelines and the European Accessibility Act.',
    status: 'Compliance status',
    statusText:
      'The website is partially compliant with WCAG 2.2 AA. We are continuously improving accessibility and fixing reported barriers.',
    reporting: 'Reporting accessibility issues',
    reportingText:
      'If you encounter an accessibility barrier on our website, please let us know. We will respond as quickly as possible and treat every report as a priority.',
    contactForm: 'Contact form:',
    phone: 'Phone:',
    address: 'Boutique address',
    appeal: 'Appeal procedure',
    appealText: 'If the response to your report is unsatisfactory, you may submit a complaint to the Polish Ombudsman:',
  },
  ua: {
    eyebrow: 'Юридичний документ',
    title: 'Декларація доступності',
    updated: 'Останнє оновлення:',
    commitment: 'Зобов’язання',
    commitmentText:
      'Бутік Warszawski Czas докладає зусиль, щоб сайт warszawskiczas.pl був доступним для всіх користувачів відповідно до рекомендацій WCAG 2.2 AA та вимог European Accessibility Act.',
    status: 'Статус відповідності',
    statusText:
      'Сайт частково відповідає WCAG 2.2 AA. Ми постійно працюємо над покращенням доступності та усуненням повідомлених бар’єрів.',
    reporting: 'Повідомлення про проблеми доступності',
    reportingText:
      'Якщо ви зіткнулися з бар’єром доступності на нашому сайті, повідомте нам. Ми відповімо якомога швидше й розглядатимемо кожне повідомлення як пріоритетне.',
    contactForm: 'Контактна форма:',
    phone: 'Телефон:',
    address: 'Адреса бутіка',
    appeal: 'Процедура оскарження',
    appealText: 'Якщо відповідь на ваше повідомлення буде незадовільною, ви можете подати скаргу до польського Омбудсмана:',
  },
} satisfies Record<Locale, Record<string, string>>

export function AccessibilityStatementPage({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = copy[locale]

  return (
    <Section spacing="lg" className="pt-32 lg:pt-40">
      <Container size="narrow">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
          {t.eyebrow}
        </p>
        <Heading as="h1" size="xl" className="mt-4">
          {t.title}
        </Heading>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {t.updated} {LAST_UPDATED}
        </p>

        <div className="mt-12 space-y-10 border-l border-accent-gold/40 pl-8">
          <section>
            <Heading as="h2" size="sm">{t.commitment}</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              {t.commitmentText}
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">{t.status}</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              {t.statusText}
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">{t.reporting}</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              {t.reportingText}
            </Text>
            <ul className="mt-6 space-y-2 font-sans text-sm">
              <li>
                {t.contactForm}{' '}
                <Link href={localizePath('/kontakt', locale)} className="text-accent-gold underline-offset-4 hover:underline">
                  warszawskiczas.pl{localizePath('/kontakt', locale)}
                </Link>
              </li>
              <li>
                E-mail:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-gold underline-offset-4 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                {t.phone}{' '}
                <a href={`tel:${CONTACT_PHONE_RAW}`} className="text-accent-gold underline-offset-4 hover:underline">
                  {CONTACT_PHONE}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <Heading as="h2" size="sm">{t.address}</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              Warszawski Czas, {ADDRESS.street}, {ADDRESS.postal} {ADDRESS.city}.
            </Text>
          </section>

          <section>
            <Heading as="h2" size="sm">{t.appeal}</Heading>
            <Text muted className="mt-4 text-base leading-relaxed">
              {t.appealText}{' '}
              <a
                href="https://www.rpo.gov.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-gold underline-offset-4 hover:underline"
              >
                rpo.gov.pl
              </a>.
            </Text>
          </section>
        </div>
      </Container>
    </Section>
  )
}
