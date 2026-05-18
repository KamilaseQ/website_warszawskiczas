import { ProductCard } from './product-card'
import type { Product } from '@/from-cms/schemas/product'

interface RelatedGridProps {
  products: Product[]
}

// Mobile: poziomy snap-scroll (uniezależnia układ od liczby modeli — żadnej
// pojedynczej karty na końcu). Desktop: równy grid 3-kolumnowy.
export function RelatedGrid({ products }: RelatedGridProps) {
  return (
    <div
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
        <div key={p.id} className="w-[68vw] flex-shrink-0 snap-start sm:w-auto">
          <ProductCard product={p} aspect="portrait" />
        </div>
      ))}
    </div>
  )
}
