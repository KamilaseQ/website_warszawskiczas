import { cn } from '@/lib/utils'
import { ProductCard } from './product-card'
import type { Product } from '@/data/mock-products'

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  className?: string
}

export function ProductGrid({
  products,
  columns = 4,
  className,
}: ProductGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
