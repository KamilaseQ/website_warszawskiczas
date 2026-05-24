import type { Product } from '@/from-cms/schemas/product'

export function isProductOnOrder(product: Pick<Product, 'status'>): boolean {
  return product.status === 'Na zamówienie'
}

export function isProductUnavailable(product: Pick<Product, 'status'>): boolean {
  return product.status === 'Niedostępny'
}

export function productPublicPrice(product: Pick<Product, 'status' | 'price'>): number | undefined {
  if (isProductOnOrder(product)) return undefined
  return product.price
}

export function productShowsPriceOnRequest(product: Pick<Product, 'status' | 'priceOnRequest'>): boolean {
  return isProductOnOrder(product) || Boolean(product.priceOnRequest)
}

export function schemaOrgAvailability(status: Product['status']): string {
  if (status === 'Na zamówienie') return 'https://schema.org/PreOrder'
  if (status === 'Niedostępny') return 'https://schema.org/OutOfStock'
  return 'https://schema.org/InStock'
}
