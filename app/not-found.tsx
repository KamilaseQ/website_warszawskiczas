import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLink } from '@/components/contact-link'
import { Container, Heading, Section, Text } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Nie znaleziono strony',
  description:
    'Strona, której szukasz, nie istnieje lub została przeniesiona. Zapraszamy do katalogu zegarków lub kontaktu.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <Section spacing="xl" className="relative bg-[#0a0a0a] text-white pt-32 lg:pt-40">
      <Container size="narrow" className="text-center">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold">
          Błąd 404
        </p>
        <Heading
          as="h1"
          size="xl"
          className="mt-6 text-white"
        >
          Strona zatrzymała <span className="italic font-normal">się tu</span>
        </Heading>

        <div className="mx-auto mt-8 h-px w-16 bg-accent-gold/60" />

        <Text className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60">
          Adres, którego szukasz, nie istnieje lub został przeniesiony.
          Zapraszamy do katalogu dostępnych egzemplarzy albo bezpośredniego
          kontaktu — odpowiadamy w ciągu 24 godzin.
        </Text>

        <div className="mt-12 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center bg-accent-gold px-6 font-serif text-[11px] uppercase tracking-[0.15em] text-[#0a0a0a] transition-colors duration-500 hover:bg-white"
          >
            Strona główna
          </Link>
          <Link
            href="/produkty"
            className="inline-flex h-11 items-center justify-center border border-white/30 px-6 font-serif text-[11px] uppercase tracking-[0.15em] text-white transition-colors duration-500 hover:border-accent-gold hover:text-accent-gold"
          >
            Zegarki w butiku
          </Link>
          <ContactLink
            source="not-found"
            className="inline-flex h-11 items-center justify-center px-6 font-serif text-[11px] uppercase tracking-[0.15em] text-white/70 transition-colors duration-500 hover:text-accent-gold"
          >
            Skontaktuj się
          </ContactLink>
        </div>
      </Container>
    </Section>
  )
}
