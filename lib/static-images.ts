import apImage from '@/public/ap-v2.webp'
import boutiqueHeroImage from '@/public/butikmain-v2.webp'
import chopardImage from '@/public/chopard-v2.webp'
import patekNautilusImage from '@/public/patek-philippe-nautilus-v2.webp'
import patekImage from '@/public/patek-v2.webp'
import rolexWimbledonImage from '@/public/rolex-wimbledon-v2.webp'

/**
 * Importy statyczne wymuszają emisję obrazów do hashowanego `/_next/static/media`.
 * Hostinger publikuje ten katalog atomowo razem z buildem, podczas gdy nowe pliki
 * pod surowymi URL-ami `/public/*` mogą pojawić się później w public_html/hCDN.
 */
export const STATIC_IMAGES = {
  ap: apImage.src,
  boutiqueHero: boutiqueHeroImage.src,
  chopard: chopardImage.src,
  patekNautilus: patekNautilusImage.src,
  patek: patekImage.src,
  rolexWimbledon: rolexWimbledonImage.src,
} as const

export function absoluteStaticImageUrl(src: string) {
  return new URL(src, 'https://warszawskiczas.pl').toString()
}
