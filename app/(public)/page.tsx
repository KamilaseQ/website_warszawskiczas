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

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <TrustSignals />
      <BrandPositioning />
      <HiddenCollectionTeaser />
      <ServicesOverview />
      <BoutiquePreview />
      <FinalCTA />
    </>
  )
}
