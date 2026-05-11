import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactLink } from '@/components/contact-link'
import { Container, Section, Heading, Text } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Regulamin',
  description: 'Regulamin świadczenia usług butiku Warszawski Czas.',
}

export default function RegulaminPage() {
  return (
    <Section spacing="lg" className="pt-32 lg:pt-40">
      <Container size="narrow">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
          Dokument prawny
        </p>
        <Heading as="h1" size="xl" className="mt-4">
          Regulamin
        </Heading>

        <div className="mt-12 space-y-6 border-l border-accent-gold/40 pl-8">
          <Text muted className="text-base leading-relaxed">
            Treść regulaminu zostanie uzupełniona przez właściciela serwisu.
            Dokument obejmie warunki świadczenia usług, zasady kontaktu,
            procedury wyceny, skupu i sprzedaży zegarków, gwarancję
            autentyczności oraz politykę zwrotów.
          </Text>

          <Text muted className="text-base leading-relaxed">
            Wszelkie pytania dotyczące współpracy i transakcji prosimy kierować
            bezpośrednio do butiku — telefonicznie lub poprzez formularz kontaktowy.
          </Text>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ContactLink
            source="regulamin"
            className="inline-flex items-center justify-center bg-foreground px-8 py-3 font-serif text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-accent-gold hover:text-foreground"
          >
            Skontaktuj się z nami
          </ContactLink>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-gold transition-colors"
          >
            <span aria-hidden>←</span> Powrót na stronę główną
          </Link>
        </div>
      </Container>
    </Section>
  )
}
