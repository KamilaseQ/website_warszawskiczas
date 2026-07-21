import { z } from 'zod'

/**
 * Schema produktu — SINGLE SOURCE OF TRUTH kontraktu strona <-> CMS.
 *
 * Każdy adapter (`from-cms/adapters/products.ts`) waliduje wejście tym schematem
 * niezależnie od trybu (mock/live), żeby błędy kontraktu wychodziły wcześnie.
 */

export const ProductCategorySchema = z.enum(['zegarki', 'bizuteria', 'akcesoria'])
export type ProductCategory = z.infer<typeof ProductCategorySchema>

export const ProductStatusSchema = z.enum(['Dostępny', 'Na zamówienie', 'Niedostępny'])
export type ProductStatus = z.infer<typeof ProductStatusSchema>

/** Legacy image list retained while old CMS snapshots are still accepted. */
export const ProductImageUrlSchema = z.string().min(1)
const ExplicitProductImageUrlSchema = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), 'Product image URL must use HTTP or HTTPS')

/**
 * Explicit CDN contract. Missing variants mean "use original" and never mean
 * "guess a URL". This prevents a speculative request and 404 for older images.
 */
export const ProductImageAssetSchema = z.object({
  original: ExplicitProductImageUrlSchema,
  thumb: ExplicitProductImageUrlSchema.optional(),
  medium: ExplicitProductImageUrlSchema.optional(),
  alt: z.string().trim().min(1).optional(),
}).refine((image) => Boolean(image.thumb) === Boolean(image.medium), {
  message: 'Product image must provide both thumb and medium variants, or neither',
})
export type ProductImageAsset = z.infer<typeof ProductImageAssetSchema>

export const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  category: ProductCategorySchema,
  material: z.string().optional(),
  reference: z.string().optional(),
  caseSize: z.string().optional(),
  year: z.union([z.number(), z.string()]).optional(),
  condition: z.string().optional(),
  price: z.number().optional(),
  priceOnRequest: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isExclusive: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: ProductStatusSchema.optional(),
  imageAssets: z.array(ProductImageAssetSchema).optional(),
  images: z.array(ProductImageUrlSchema).optional(),
  description: z.string().min(1),
  editorial: z.string().optional(),
  story: z.string().optional(),
  /** ISO 8601 — wymagane od CMS, opcjonalne w mock fixtures. */
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Product = z.infer<typeof ProductSchema>

export const ProductListSchema = z.array(ProductSchema)
