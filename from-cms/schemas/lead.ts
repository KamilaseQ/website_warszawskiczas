import { z } from 'zod'

/**
 * Schema leada wysyłanego ze strony do CMS przez `POST /api/v1/leads`.
 *
 * To jest publiczny kontrakt — CMS musi go zaakceptować bez modyfikacji.
 * Zmiana ŁAMIĄCA (nowe pole wymagane, zmiana typu, zaostrzenie limitu) wymaga
 * bump wersji `/api/v1/` -> `/api/v2/`.
 *
 * Pole OPCJONALNE dodane do tego schematu wersji NIE łamie: `z.object()` po obu
 * stronach strippuje nieznane klucze, więc CMS sprzed zmiany przyjmie payload
 * z nowym polem i po prostu je zignoruje. Dzięki temu strona może wyjść na
 * produkcję przed aplikacją. Tak dodane zostało `attachments`.
 */

/**
 * Tylko dwa typy:
 *  - `contact` — formularz na stronie /kontakt (ogólne zapytanie)
 *  - `inquiry` — zapytanie kontekstowe (z karty produktu, z landinga, ze strony
 *    usługi: skup / komis / naprawa)
 *
 * Konkretne źródło leada trafia w polu `source`, nie w `type`.
 */
export const LeadTypeSchema = z.enum(['contact', 'inquiry'])
export type LeadType = z.infer<typeof LeadTypeSchema>

/**
 * Zdjęcia dołączone do zgłoszenia (opcjonalne).
 *
 * Lecą jako base64 w tym samym JSON-ie co reszta leada — świadomie, zamiast
 * `multipart/form-data`:
 *  - CMS i `/api/contact` czytają `request.json()`; multipart wymagałby zmiany
 *    po obu stronach JEDNOCZEŚNIE, a base64 w opcjonalnym polu jest wstecznie
 *    zgodny (stary CMS zignoruje pole zamiast odrzucić zgłoszenie),
 *  - `application/json` nie zmienia preflightu CORS-a po stronie CMS.
 *
 * Koszt: +33% rozmiaru. Dlatego przeglądarka skaluje i przekodowuje zdjęcia
 * PRZED wysyłką (patrz `components/forms/photo-attachments.tsx`), a limity
 * poniżej są twardym zabezpieczeniem serwera, nie docelowym rozmiarem.
 */
export const MAX_LEAD_ATTACHMENTS = 5
/** Limit na pojedyncze zdjęcie PO kompresji w przeglądarce (bajty binarne). */
export const MAX_LEAD_ATTACHMENT_BYTES = 1_500_000
/** Limit łączny na wszystkie zdjęcia w jednym zgłoszeniu (bajty binarne). */
export const MAX_LEAD_ATTACHMENTS_TOTAL_BYTES = 4_000_000

/** Formaty, które przeglądarka potrafi wyprodukować z `canvas.toBlob`. */
export const LEAD_ATTACHMENT_TYPES = ['image/webp', 'image/jpeg', 'image/png'] as const

/** base64 rośnie 4/3 względem bajtów; +8 znaków zapasu na padding. */
const maxBase64Chars = (bytes: number) => Math.ceil(bytes / 3) * 4 + 8

/** Długość base64 -> liczba bajtów po zdekodowaniu (bez alokowania bufora). */
export function base64ByteLength(value: string): number {
  const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0
  return Math.floor((value.length * 3) / 4) - padding
}

export const LeadAttachmentSchema = z.object({
  /** Nazwa pliku wyłącznie do wyświetlenia — nigdy nie jest ścieżką na dysku. */
  name: z.string().trim().min(1).max(120),
  type: z.enum(LEAD_ATTACHMENT_TYPES),
  /** Czysty base64, BEZ prefiksu `data:...;base64,`. */
  data: z
    .string()
    .min(1)
    .max(maxBase64Chars(MAX_LEAD_ATTACHMENT_BYTES))
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, 'Załącznik musi być czystym base64.'),
})

export type LeadAttachment = z.infer<typeof LeadAttachmentSchema>

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

  /** Opcjonalne zdjęcia. Brak pola = zgłoszenie bez zdjęć (stan sprzed zmiany). */
  attachments: z
    .array(LeadAttachmentSchema)
    .max(MAX_LEAD_ATTACHMENTS)
    .optional()
    .refine(
      (items) =>
        !items ||
        items.reduce((total, item) => total + base64ByteLength(item.data), 0) <=
          MAX_LEAD_ATTACHMENTS_TOTAL_BYTES,
      { message: 'Łączny rozmiar zdjęć jest za duży.' },
    ),
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
    /** Czy zdjęcia faktycznie doszły tym kanałem (mail: załącznik, CMS: zapis w R2). */
    attachments: z.boolean().optional(),
  }).optional(),
})

export type LeadResponse = z.infer<typeof LeadResponseSchema>
