import type { Metadata } from 'next'
import { BoutiquePage } from '@/components/pages/boutique-page'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Butik Warszawski Czas — Mokotowska 71, Warszawa',
  description:
    'Odwiedź butik Warszawski Czas na Mokotowskiej 71 w Warszawie. Editorialna przestrzeń dla kolekcjonerów zegarków premium — godziny, dojazd, kontakt.',
  alternates: localizedAlternates('/butik', 'pl'),
  openGraph: {
    type: 'website',
    url: 'https://warszawskiczas.pl/butik',
    title: 'Butik Warszawski Czas — Mokotowska 71, Warszawa',
    description: 'Editorialna przestrzeń dla kolekcjonerów zegarków premium w sercu Warszawy.',
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
}

export default function ButikPage() {
  return <BoutiquePage />
}
