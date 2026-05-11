import type { Metadata } from 'next'
import { WatchBuyingServicePage } from '@/components/pages/services-pages'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Skup zegarków Warszawa — Rolex, Omega, Patek Philippe',
  description:
    'Skup zegarków premium w Warszawie. Uczciwa wycena, natychmiastowa płatność, dyskrecja. Rolex, Omega, Patek Philippe, Audemars Piguet i inne marki — Mokotowska 71.',
  alternates: localizedAlternates('/uslugi/skup', 'pl'),
  openGraph: {
    type: 'website',
    url: 'https://warszawskiczas.pl/uslugi/skup',
    title: 'Skup zegarków Warszawa — Rolex, Omega, Patek Philippe',
    description:
      'Skup zegarków premium w Warszawie. Bezpłatna wycena, natychmiastowa płatność, pełna dyskrecja.',
    siteName: 'Warszawski Czas',
    locale: 'pl_PL',
  },
}

export default function SkupPage() {
  return <WatchBuyingServicePage />
}
