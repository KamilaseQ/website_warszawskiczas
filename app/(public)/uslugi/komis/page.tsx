import type { Metadata } from 'next'
import { ConsignmentServicePage } from '@/components/pages/services-pages'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Komis zegarków Warszawa — sprzedaż dyskretna i premium',
  description:
    'Komis zegarków Warszawa: sprzedaż Rolex, Patek Philippe, AP, Omega i Cartier w butiku. Prezentacja, negocjacje i dyskretne rozliczenie.',
  alternates: localizedAlternates('/uslugi/komis', 'pl'),
  openGraph: {
    type: 'website',
    url: 'https://warszawskiczas.pl/uslugi/komis',
    title: 'Komis zegarków Warszawa — sprzedaż dyskretna i premium',
    description: 'Sprzedaż komisowa zegarków premium. Dyskrecja, dostęp do kolekcjonerów, prezentacja butikowa.',
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
}

export default function KomisPage() {
  return <ConsignmentServicePage />
}
