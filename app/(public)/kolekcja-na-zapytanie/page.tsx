import type { Metadata } from 'next'
import { PrivateCollectionPage } from '@/components/pages/private-collection-page'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Kolekcja Prywatna',
  description:
    'Kolekcja prywatna zegarków: rzadkie Rolex, Patek Philippe, AP, Cartier i Omega dostępne po konsultacji. Egzemplarze od ręki i na zamówienie.',
  alternates: localizedAlternates('/kolekcja-na-zapytanie', 'pl'),
}

export default function Page() {
  return <PrivateCollectionPage />
}
