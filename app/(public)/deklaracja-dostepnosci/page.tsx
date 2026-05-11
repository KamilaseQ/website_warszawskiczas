import type { Metadata } from 'next'
import { AccessibilityStatementPage } from '@/components/pages/accessibility-statement-page'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Deklaracja dostępności',
  description:
    'Deklaracja dostępności cyfrowej serwisu Warszawski Czas — zgodność z WCAG 2.2 AA i kontakt do zgłaszania barier.',
  alternates: localizedAlternates('/deklaracja-dostepnosci', 'pl'),
  robots: {
    index: true,
    follow: true,
  },
}

export default function DeklaracjaDostepnosciPage() {
  return <AccessibilityStatementPage />
}
