import type { Metadata } from 'next'
import { PrivateCollectionPage } from '@/components/pages/private-collection-page'

export const metadata: Metadata = {
  title: 'Kolekcja Prywatna',
  description:
    'Kolekcja prywatna zegarków: rzadkie Rolex, Patek Philippe, AP, Cartier i Omega dostępne po konsultacji. Egzemplarze od ręki i na zamówienie.',
}

export default function Page() {
  return <PrivateCollectionPage />
}
