import type { Metadata } from 'next'
import { ThankYouPage } from '@/components/pages/thank-you-page'
import { localizedCanonical } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Dziękujemy',
  description: 'Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.',
  alternates: localizedCanonical('/kontakt/dziekujemy', 'pl'),
  robots: { index: false, follow: true },
}

export default function DziekujemyPage() {
  return <ThankYouPage />
}
