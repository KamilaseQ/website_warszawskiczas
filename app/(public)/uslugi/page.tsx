import type { Metadata } from 'next'
import { ServicesPage } from '@/components/pages/services-pages'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Usługi',
  description:
    'Usługi zegarkowe Warszawa: skup, komis, wycena, serwis i sprowadzanie Rolex, Patek Philippe, AP, Omega, Cartier. Mokotowska 71.',
  alternates: localizedAlternates('/uslugi', 'pl'),
}

export default function UslugiPage() {
  return <ServicesPage />
}
