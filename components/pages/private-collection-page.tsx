import {
  PrivateCollectionHero,
  PrivateCollectionFeatured,
  PrivateCollectionValue,
  PrivateCollectionProcess,
  PrivateCollectionFAQ,
  PrivateCollectionRegistration,
} from '@/components/sections'
import type { Locale } from '@/lib/i18n'

export function PrivateCollectionPage({ locale = 'pl' }: { locale?: Locale } = {}) {
  return (
    <>
      <PrivateCollectionHero locale={locale} />
      <PrivateCollectionFeatured locale={locale} />
      <PrivateCollectionValue locale={locale} />
      <PrivateCollectionProcess locale={locale} />
      <PrivateCollectionFAQ locale={locale} />
      <PrivateCollectionRegistration locale={locale} />
    </>
  )
}
