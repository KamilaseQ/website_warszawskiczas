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
