import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(6).max(30).regex(/^[+\d\s\-()]+$/),
  message: z.string().trim().min(1).max(2000),
  rodo: z.literal(true),

  company: z.string().max(0),
  t: z.number().int().positive(),

  source: z.string().max(80).optional(),
  product: z.string().max(120).optional(),
  sessionPath: z.array(z.string().max(200)).max(8).optional(),
  referrer: z.string().max(300).optional(),
})

export type ContactPayload = z.infer<typeof contactSchema>
