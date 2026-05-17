import { z } from 'zod'

/**
 * Schema produktu — SINGLE SOURCE OF TRUTH kontraktu strona <-> CMS.
 *
 * Każdy adapter (`from-cms/adapters/products.ts`) waliduje wejście tym schematem
 * niezależnie od trybu (mock/live), żeby błędy kontraktu wychodziły wcześnie.
 */

export const ProductCategorySchema = z.enum(['zegarki', 'bizuteria', 'akcesoria'])
export type ProductCategory = z.infer<typeof ProductCategorySchema>

export const ProductStatusSchema = z.enum(['Dostępny', 'Zarezerwowany', 'Niedostępny'])
export type ProductStatus = z.infer<typeof ProductStatusSchema>

/**
 * Pre-live format obrazu: lista absolutnych URL-i (na razie path-style w `/products/<slug>/...`,
 * po migracji do R2 absolutne URL-e CDN typu `https://cdn.warszawskiczas.pl/<slug>/...`).
 *
 * Po wdrożeniu live CMS schemat tej tablicy przejdzie na obiekt `ProductImage`
 * z wariantami rozmiaru — patrz checklista CMS sekcja A4.
 */
export const ProductImageUrlSchema = z.string().min(1)

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
