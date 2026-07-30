'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'
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
  /**
   * Nie montuje nawet znacznika <img>, dopóki karta nie znajdzie się blisko
   * viewportu. Natywne loading="lazy" w Chrome ma szeroki próg (kilka ekranów)
   * i przy długim katalogu potrafi pobrać kilkanaście zdjęć od razu.
   */
  deferUntilVisible?: boolean
}

export function ProductImage({
  image,
  variant,
  deferUntilVisible = false,
  onError,
  ...props
}: ProductImageProps) {
  const visibilityRef = useRef<HTMLSpanElement>(null)
  const [shouldRender, setShouldRender] = useState(!deferUntilVisible)
  const original = productImageOriginal(image)
  const preferred = productImageVariantUrl(image, variant)
  const alternate =
    typeof image === 'string'
      ? original
      : variant === 'thumb'
        ? image.medium ?? original
        : image.thumb ?? original
  const candidates = [...new Set([preferred, alternate, original])]
  const [failedSources, setFailedSources] = useState<string[]>([])
  const src = candidates.find((candidate) => !failedSources.includes(candidate)) ?? original

  useEffect(() => {
    if (!deferUntilVisible) {
      setShouldRender(true)
      return
    }
    if (shouldRender) return
    const target = visibilityRef.current
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShouldRender(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setShouldRender(true)
        observer.disconnect()
      },
      { rootMargin: '800px 0px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [deferUntilVisible, shouldRender])

  const renderedImage = (
    <Image
      {...props}
      src={src}
      onError={(event) => {
        if (src !== original) {
          setFailedSources((current) =>
            current.includes(src) ? current : [...current, src],
          )
        }
        onError?.(event)
      }}
    />
  )

  if (!deferUntilVisible) return renderedImage

  return (
    <span
      ref={visibilityRef}
      data-deferred-product-image={shouldRender ? 'loaded' : 'pending'}
      data-deferred-image-variant={variant}
      data-deferred-image-src={src}
      className="absolute inset-0 block"
    >
      {shouldRender ? renderedImage : null}
    </span>
  )
}
