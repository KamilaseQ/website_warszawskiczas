'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useEffect, useRef } from 'react'
import { markCriticalHeroReady } from '@/lib/critical-hero'

type CriticalHeroImageProps = Omit<ImageProps, 'src'> & {
  src: string
}

export function CriticalHeroImage({ onLoad, src, ...props }: CriticalHeroImageProps) {
  const imageRef = useRef<HTMLImageElement>(null)

  const markReady = useCallback(
    async (image: HTMLImageElement | null) => {
      if (!image?.complete || image.naturalWidth === 0) return

      try {
        await image.decode()
      } catch {
        // If decoding was already handled by the browser, load completion is enough.
      }

      markCriticalHeroReady(src)
    },
    [src],
  )

  useEffect(() => {
    void markReady(imageRef.current)
  }, [markReady])

  return (
    <Image
      ref={imageRef}
      src={src}
      onLoad={(event) => {
        onLoad?.(event)
        void markReady(event.currentTarget)
      }}
      {...props}
    />
  )
}
