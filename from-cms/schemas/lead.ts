import { z } from 'zod'

/**
 * Schema leada wysyłanego ze strony do CMS przez `POST /api/v1/leads`.
 *
 * To jest publiczny kontrakt — CMS musi go zaakceptować bez modyfikacji.
 * Zmiana wymaga bump wersji `/api/v1/` -> `/api/v2/`.
 */

/**
 * Tylko dwa typy:
 *  - `contact` — formularz na stronie /kontakt (ogólne zapytanie)
 *  - `inquiry` — zapytanie kontekstowe (z karty produktu, z landinga, z sekcji
 *    "Kolekcja Prywatna" — ta ostatnia to wizualny teaser, nie osobny segment)
 *
 * Źródło leada (np. landing, produkt, kolekcja prywatna) trafia w polu `source`,
 * nie w `type`.
 */
export const LeadTypeSchema = z.enum(['contact', 'inquiry'])
export type LeadType = z.infer<typeof LeadTypeSchema>

export const LeadPayloadSchema = z.object({
  type: LeadTypeSchema,
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(6).max(30).regex(/^[+\d\s\-()]+$/),
  message: z.string().trim().min(1).max(2000),
  rodo: z.literal(true),

  /** Honeypot — wartość niepusta = bot. */
  company: z.string().max(0),
  /** Timestamp wypełnienia formularza (Date.now() przy renderze). */
  t: z.number().int().positive(),

  source: z.string().max(80).optional(),
  product: z.string().max(120).optional(),
  sessionPath: z.array(z.string().max(200)).max(8).optional(),
  referrer: z.string().max(300).optional(),
})

export type LeadPayload = z.infer<typeof LeadPayloadSchema>

export const LeadResponseSchema = z.object({
  ok: z.boolean(),
  error: z.string().optional(),
  delivery: z.object({
    lead: z.boolean().optional(),
    email: z.boolean().optional(),
    confirmation: z.boolean().optional(),
    whatsapp: z.boolean().optional(),
  }).optional(),
})

export type LeadResponse = z.infer<typeof LeadResponseSchema>
