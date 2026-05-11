import type { Metadata } from 'next'
import { PrivateCollectionPage } from '@/components/pages/private-collection-page'

export const metadata: Metadata = {
  title: 'Kolekcja Prywatna',
  description:
    'Ekskluzywna kolekcja zegarków dostępna po weryfikacji. Rzadkie modele, prywatne kolekcje, indywidualne podejście.',
}

export default function Page() {
  return <PrivateCollectionPage />
}
