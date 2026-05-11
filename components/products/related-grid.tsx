'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ProductCard } from './product-card'
import type { Product } from '@/data/mock-products'

interface RelatedGridProps {
  products: Product[]
}

// Mobile: poziomy snap-scroll (uniezależnia układ od liczby modeli — żadnej
// pojedynczej karty na końcu). Desktop: równy grid 3-kolumnowy.
export function RelatedGrid({ products }: RelatedGridProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: reducedMotion ? 0 : 0.05 },
        },
      }}
      className={[
        // Mobile: poziomy scroller
        'no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-6 px-6 pb-2',
        // sm+: powrót do gridu
        'sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-0',
        // lg: 3 kolumny
        'lg:grid-cols-3 lg:gap-x-8',
      ].join(' ')}
    >
      {products.map((p) => (
        <motion.div
          key={p.id}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: 'easeOut' },
            },
          }}
          className="w-[68vw] flex-shrink-0 snap-start sm:w-auto"
        >
          <ProductCard product={p} aspect="portrait" />
        </motion.div>
      ))}
    </motion.div>
  )
}
