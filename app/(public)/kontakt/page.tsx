import type { Metadata } from 'next'
import { ContactPage } from '@/components/pages/contact-page'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Kontakt — Warszawski Czas, Mokotowska 71, Warszawa',
  description:
    'Skontaktuj się z butikiem Warszawski Czas. Telefon, e-mail, WhatsApp, formularz. Mokotowska 71, Warszawa.',
  alternates: localizedAlternates('/kontakt', 'pl'),
  openGraph: {
    type: 'website',
    url: 'https://warszawskiczas.pl/kontakt',
    title: 'Kontakt — Warszawski Czas, Mokotowska 71',
    description: 'Telefon, e-mail, WhatsApp, mapa dojazdu i formularz kontaktowy.',
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
}

export default function KontaktPage() {
  return <ContactPage />
}
