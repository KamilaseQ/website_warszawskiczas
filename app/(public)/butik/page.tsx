import type { Metadata } from 'next'
import { BoutiquePage } from '@/components/pages/boutique-page'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Butik Warszawski Czas — Mokotowska 71, Warszawa',
  description:
    'Butik zegarków Warszawa, Mokotowska 71: nowe, nieużywane i używane Rolex, Patek Philippe, AP, Omega, Cartier. Prywatne prezentacje i wyceny.',
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
