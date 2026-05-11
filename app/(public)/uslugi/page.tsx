import type { Metadata } from 'next'
import { ServicesPage } from '@/components/pages/services-pages'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Usługi',
  description:
    'Profesjonalne usługi zegarmistrzowskie: serwis i naprawa, skup zegarków, komis. Wieloletnie doświadczenie, uczciwe podejście.',
  alternates: localizedAlternates('/uslugi', 'pl'),
}

export default function UslugiPage() {
  return <ServicesPage />
}
