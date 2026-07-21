'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import type { CdnImageVariant } from '@/lib/cdn-image'
import {
  productImageOriginal,
  productImageVariantUrl,
  type ProductImageSource,
} from '@/lib/product-images'

/**
 * Obraz produktu z wariantem CDN (WebP) i REALNYM fallbackiem do oryginału.
 *
 * Nowy kontrakt podaje jawne URL-e wariantów; brak wariantu od razu wybiera
 * oryginał bez żądania 404. Stare snapshoty nadal korzystają z wyliczanego URL-a
 * i jednorazowego fallbacku do oryginału.
 */
type ProductImageProps = Omit<ImageProps, 'src'> & {
  image: ProductImageSource
  variant: CdnImageVariant
}

export function ProductImage({ image, variant, onError, ...props }: ProductImageProps) {
  const original = productImageOriginal(image)
  const preferred = productImageVariantUrl(image, variant)
  const [failedPreferred, setFailedPreferred] = useState<string | null>(null)
  const src = failedPreferred === preferred ? original : preferred

  return (
    <Image
      {...props}
      src={src}
      onError={(event) => {
        if (src !== original) setFailedPreferred(preferred)
        onError?.(event)
      }}
    />
  )
}
