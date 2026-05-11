import type { Metadata } from 'next'
import { ThankYouPage } from '@/components/pages/thank-you-page'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Dziękujemy',
  description: 'Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.',
  alternates: localizedAlternates('/kontakt/dziekujemy', 'pl'),
  robots: { index: false, follow: true },
}

export default function DziekujemyPage() {
  return <ThankYouPage />
}
