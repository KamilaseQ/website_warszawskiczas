import type { Metadata } from 'next'
import {
  Hero,
  BrandPositioning,
  ProductShowcase,
  HiddenCollectionTeaser,
  ServicesOverview,
  BoutiquePreview,
  TrustSignals,
  FinalCTA,
} from '@/components/sections'
import { getFeaturedProduct, getOtherFeaturedProducts } from '@/from-cms/adapters/products'
import { localizedAlternates } from '@/lib/i18n'

export const metadata: Metadata = {
  alternates: localizedAlternates('/', 'pl'),
}

export default async function HomePage() {
  const [featured, others] = await Promise.all([
    getFeaturedProduct(),
    getOtherFeaturedProducts(6),
  ])
  return (
    <>
      <Hero />
      <ProductShowcase featured={featured} others={others} />
      <TrustSignals />
      <BrandPositioning />
      <HiddenCollectionTeaser />
      <ServicesOverview />
      <BoutiquePreview />
      <FinalCTA />
    </>
  )
}
