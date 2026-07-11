import type { Metadata } from 'next'
import { RepairServicePage } from '@/components/pages/services-pages'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Serwis zegarków Warszawa — naprawa, przegląd, renowacja',
  description:
    'Serwis zegarków Warszawa: przeglądy, naprawy, regulacje i renowacje Rolex, Omega, Patek Philippe, Cartier i innych marek premium.',
  alternates: localizedAlternates('/uslugi/naprawa-i-serwis', 'pl'),
  openGraph: {
    type: 'website',
    url: 'https://warszawskiczas.pl/uslugi/naprawa-i-serwis',
    title: 'Serwis zegarków Warszawa — naprawa, przegląd, renowacja',
    description: 'Profesjonalny serwis zegarmistrzowski przy Mokotowskiej 71 w Warszawie.',
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
}

export default function NaprawaISerwisPage() {
  return <RepairServicePage />
}
