'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import { cdnImageVariant, type CdnImageVariant } from '@/lib/cdn-image'

/**
 * Obraz produktu z wariantem CDN (WebP) i REALNYM fallbackiem do oryginału.
 *
 * `cdnImageVariant` podmienia URL na lekki wariant (`thumb`/`medium`). Gdy taki
 * wariant nie istnieje na CDN (404 — np. świeży produkt bez wygenerowanych
 * wariantów), `onError` wraca do oryginału zamiast pokazywać połamane zdjęcie.
 * Fallback wykonuje się raz; jeśli oryginał też padnie, zostaje `alt`.
 */
type ProductImageProps = Omit<ImageProps, 'src'> & {
  original: string
  variant: CdnImageVariant
}

export function ProductImage({ original, variant, ...props }: ProductImageProps) {
  const [src, setSrc] = useState(() => cdnImageVariant(original, variant) ?? original)

  return (
    <Image
      {...props}
      src={src}
      onError={() => {
        if (src !== original) setSrc(original)
      }}
    />
  )
}
