'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n'
import {
  MAX_LEAD_ATTACHMENTS,
  MAX_LEAD_ATTACHMENT_BYTES,
  MAX_LEAD_ATTACHMENTS_TOTAL_BYTES,
  type LeadAttachment,
} from '@/from-cms/schemas/lead'

/**
 * Opcjonalne zdjęcia przy formularzu.
 *
 * Cała kompresja dzieje się w przeglądarce: zdjęcie z telefonu ma 3–8 MB, a do
 * rozpoznania zegarka wystarcza 1600 px. Bez tego kroku base64 w JSON-ie
 * przekroczyłby limity `/api/contact` i Workera CMS-a.
 *
 * Komponent trzyma stan zdjęć u siebie i oddaje go formularzowi przez
 * `onChange` — formularze wysyłają JSON, więc `<input type="file">` NIE jest
 * częścią `FormData` i celowo nie ma atrybutu `name`.
 */

/** Dłuższa krawędź po przeskalowaniu. */
const MAX_EDGE = 1600
const ENCODE_QUALITY = 0.82
/** Wejście z telefonu bywa ogromne; powyżej tego nie próbujemy nawet dekodować. */
const MAX_SOURCE_BYTES = 25 * 1024 * 1024
/** Formaty, które umie wyprodukować `canvas.toBlob` w każdej wspieranej przeglądarce. */
const OUTPUT_TYPES = ['image/webp', 'image/jpeg'] as const
type OutputType = (typeof OUTPUT_TYPES)[number]

export type PhotoAttachment = LeadAttachment & {
  id: string
  previewUrl: string
  bytes: number
}

const copy = {
  pl: {
    label: 'Zdjęcia (opcjonalnie)',
    hint: `Do ${MAX_LEAD_ATTACHMENTS} zdjęć. Pomagają nam wstępnie wycenić zegarek jeszcze przed rozmową.`,
    add: 'Dodaj zdjęcia',
    adding: 'Przygotowuję zdjęcia...',
    remove: 'Usuń zdjęcie',
    privacy: 'Zdjęcia trafiają wyłącznie do butiku razem z Twoim zgłoszeniem.',
    tooMany: `Możesz dodać maksymalnie ${MAX_LEAD_ATTACHMENTS} zdjęć.`,
    notImage: 'to nie jest plik graficzny.',
    sourceTooBig: 'jest zbyt duży (max 25 MB).',
    unreadable: 'nie udało się odczytać. Zapisz je jako JPG lub PNG i spróbuj ponownie.',
    tooBig: 'jest za duże nawet po kompresji.',
    totalTooBig: 'Łączny rozmiar zdjęć jest za duży. Usuń jedno ze zdjęć.',
    summaryOne: 'zdjęcie',
    summaryFew: 'zdjęcia',
    summaryMany: 'zdjęć',
  },
  en: {
    label: 'Photos (optional)',
    hint: `Up to ${MAX_LEAD_ATTACHMENTS} photos. They help us pre-value the watch before we talk.`,
    add: 'Add photos',
    adding: 'Preparing photos...',
    remove: 'Remove photo',
    privacy: 'Photos go only to the boutique, together with your enquiry.',
    tooMany: `You can add at most ${MAX_LEAD_ATTACHMENTS} photos.`,
    notImage: 'is not an image file.',
    sourceTooBig: 'is too large (max 25 MB).',
    unreadable: 'could not be read. Save it as JPG or PNG and try again.',
    tooBig: 'is too large even after compression.',
    totalTooBig: 'The photos are too large in total. Remove one of them.',
    summaryOne: 'photo',
    summaryFew: 'photos',
    summaryMany: 'photos',
  },
  ua: {
    label: 'Фото (за бажанням)',
    hint: `До ${MAX_LEAD_ATTACHMENTS} фото. Вони допомагають попередньо оцінити годинник ще до розмови.`,
    add: 'Додати фото',
    adding: 'Готую фото...',
    remove: 'Видалити фото',
    privacy: 'Фото потрапляють лише до бутіка разом із вашим запитом.',
    tooMany: `Можна додати щонайбільше ${MAX_LEAD_ATTACHMENTS} фото.`,
    notImage: 'не є графічним файлом.',
    sourceTooBig: 'завеликий (макс. 25 МБ).',
    unreadable: 'не вдалося прочитати. Збережіть його як JPG або PNG і спробуйте ще раз.',
    tooBig: 'завелике навіть після стиснення.',
    totalTooBig: 'Сумарний розмір фото завеликий. Видаліть одне з них.',
    summaryOne: 'фото',
    summaryFew: 'фото',
    summaryMany: 'фото',
  },
} satisfies Record<Locale, Record<string, string>>

interface PhotoAttachmentsProps {
  value: PhotoAttachment[]
  onChange: (next: PhotoAttachment[]) => void
  locale?: Locale
  variant?: 'light' | 'dark'
  disabled?: boolean
}

export function PhotoAttachments({
  value,
  onChange,
  locale = 'pl',
  variant = 'light',
  disabled = false,
}: PhotoAttachmentsProps) {
  const t = copy[locale]
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const isDark = variant === 'dark'

  // Podglądy to `blob:` URL-e. Trzymamy je w refie i zwalniamy przy odmontowaniu
  // formularza — po udanej wysyłce formularz podmienia się na ekran podziękowania.
  const liveUrls = useRef<Set<string>>(new Set())
  useEffect(() => {
    const urls = liveUrls.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      setBusy(true)

      const problems: string[] = []
      const accepted: PhotoAttachment[] = []
      let remainingSlots = MAX_LEAD_ATTACHMENTS - value.length
      let totalBytes = value.reduce((sum, photo) => sum + photo.bytes, 0)

      for (const file of Array.from(files)) {
        if (remainingSlots <= 0) {
          problems.push(t.tooMany)
          break
        }
        if (!file.type.startsWith('image/')) {
          problems.push(`${file.name}: ${t.notImage}`)
          continue
        }
        if (file.size > MAX_SOURCE_BYTES) {
          problems.push(`${file.name}: ${t.sourceTooBig}`)
          continue
        }

        const prepared = await preparePhoto(file)
        if (!prepared) {
          problems.push(`${file.name}: ${t.unreadable}`)
          continue
        }
        if (prepared.blob.size > MAX_LEAD_ATTACHMENT_BYTES) {
          problems.push(`${file.name}: ${t.tooBig}`)
          continue
        }
        if (totalBytes + prepared.blob.size > MAX_LEAD_ATTACHMENTS_TOTAL_BYTES) {
          problems.push(t.totalTooBig)
          break
        }

        const previewUrl = URL.createObjectURL(prepared.blob)
        liveUrls.current.add(previewUrl)
        accepted.push({
          id: `${Date.now()}-${accepted.length}-${Math.random().toString(36).slice(2, 8)}`,
          name: displayName(file.name, prepared.extension),
          type: prepared.type,
          data: prepared.base64,
          bytes: prepared.blob.size,
          previewUrl,
        })
        totalBytes += prepared.blob.size
        remainingSlots -= 1
      }

      if (accepted.length > 0) onChange([...value, ...accepted])
      setErrors(problems)
      setBusy(false)
      // Bez resetu ponowny wybór tego samego pliku nie odpaliłby zdarzenia `change`.
      if (inputRef.current) inputRef.current.value = ''
    },
    [onChange, t, value],
  )

  const removePhoto = (id: string) => {
    const target = value.find((photo) => photo.id === id)
    if (target) {
      URL.revokeObjectURL(target.previewUrl)
      liveUrls.current.delete(target.previewUrl)
    }
    setErrors([])
    onChange(value.filter((photo) => photo.id !== id))
  }

  const totalBytes = value.reduce((sum, photo) => sum + photo.bytes, 0)
  const blocked = disabled || busy
  const isFull = value.length >= MAX_LEAD_ATTACHMENTS

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor={inputId}
          className={cn(
            'mb-2 block text-[10px] font-sans font-bold uppercase tracking-[0.35em]',
            isDark ? 'text-white/60' : 'text-muted-foreground',
          )}
        >
          {t.label}
        </label>
        <p className={cn('text-xs leading-relaxed', isDark ? 'text-white/45' : 'text-muted-foreground')}>
          {t.hint}
        </p>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        disabled={blocked || isFull}
        onChange={(event) => void handleFiles(event.target.files)}
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={blocked || isFull}
          className={cn(
            'inline-flex items-center gap-2 border px-4 py-2.5 font-sans text-xs uppercase tracking-[0.2em] transition-colors',
            isDark
              ? 'border-white/25 text-white/80 hover:border-accent-gold hover:text-accent-gold'
              : 'border-border text-muted-foreground hover:border-accent-gold hover:text-accent-gold',
            (blocked || isFull) && 'cursor-not-allowed opacity-50',
          )}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
          {busy ? t.adding : t.add}
        </button>

        {value.length > 0 && (
          <span className={cn('font-sans text-xs', isDark ? 'text-white/45' : 'text-muted-foreground')}>
            {value.length} {pluralize(value.length, t, locale)} · {formatSize(totalBytes)}
          </span>
        )}
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {value.map((photo) => (
            <li key={photo.id} className="relative">
              {/* Podgląd to `blob:` URL wygenerowany w przeglądarce — poza zakresem next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.previewUrl}
                alt={photo.name}
                className={cn('h-20 w-20 object-cover border', isDark ? 'border-white/20' : 'border-border')}
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label={`${t.remove}: ${photo.name}`}
                className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center border border-accent-gold/60 bg-[#0a0a0a] text-white transition-colors hover:bg-accent-gold hover:text-[#0a0a0a]"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div aria-live="polite" className="space-y-1">
        {errors.map((error) => (
          <p key={error} className="font-sans text-xs text-red-500">
            {error}
          </p>
        ))}
      </div>

      {value.length > 0 && (
        <p className={cn('font-sans text-[11px]', isDark ? 'text-white/35' : 'text-muted-foreground/70')}>
          {t.privacy}
        </p>
      )}
    </div>
  )
}

/** Payload do wysyłki — bez pól czysto UI-owych (`id`, `previewUrl`, `bytes`). */
export function toLeadAttachments(photos: PhotoAttachment[]): LeadAttachment[] | undefined {
  if (photos.length === 0) return undefined
  return photos.map(({ name, type, data }) => ({ name, type, data }))
}

function pluralize(count: number, t: (typeof copy)['pl'], locale: Locale): string {
  if (locale === 'en') return count === 1 ? t.summaryOne : t.summaryMany
  if (count === 1) return t.summaryOne
  const lastTwo = count % 100
  const last = count % 10
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return t.summaryFew
  return t.summaryMany
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/** Nazwa pokazywana w mailu — bez ścieżek i z rozszerzeniem po przekodowaniu. */
function displayName(original: string, extension: string): string {
  const base = original.split(/[\\/]/).pop() ?? original
  const withoutExtension = base.replace(/\.[^.]+$/, '') || 'zdjecie'
  return `${withoutExtension.slice(0, 100)}.${extension}`
}

type PreparedPhoto = {
  blob: Blob
  base64: string
  type: OutputType
  extension: string
}

/**
 * Dekoduje, skaluje do `MAX_EDGE` i przekodowuje na WebP (fallback JPEG dla
 * przeglądarek bez `toBlob('image/webp')`). `null` = przeglądarka nie potrafi
 * odczytać pliku (np. HEIC poza Safari) — wtedy prosimy o inny format zamiast
 * wysyłać kilkanaście MB oryginału.
 */
async function preparePhoto(file: File): Promise<PreparedPhoto | null> {
  const decoded = await decodeImage(file)
  if (!decoded) return null

  try {
    const { source, width: sourceWidth, height: sourceHeight } = decoded
    if (sourceWidth === 0 || sourceHeight === 0) return null

    const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(1, Math.round(sourceWidth * scale))
    const height = Math.max(1, Math.round(sourceHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return null
    context.drawImage(source, 0, 0, width, height)

    const blob = (await canvasToBlob(canvas, 'image/webp')) ?? (await canvasToBlob(canvas, 'image/jpeg'))
    if (!blob) return null

    const type: OutputType = blob.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
    return {
      blob,
      base64: await blobToBase64(blob),
      type,
      extension: type === 'image/webp' ? 'webp' : 'jpg',
    }
  } finally {
    decoded.release()
  }
}

type DecodedImage = {
  source: CanvasImageSource
  width: number
  height: number
  release: () => void
}

async function decodeImage(file: File): Promise<DecodedImage | null> {
  if (typeof createImageBitmap === 'function') {
    try {
      // `imageOrientation` jest kluczowe: bez niego zdjęcie z telefonu z obrotem
      // w EXIF trafia na canvas położone na boku. `<img>` poniżej stosuje EXIF sam.
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      }
    } catch {
      // Format nieobsługiwany przez `createImageBitmap` — próbujemy jeszcze przez <img>.
    }
  }

  const url = URL.createObjectURL(file)
  const image = await new Promise<HTMLImageElement | null>((resolve) => {
    const element = new Image()
    element.onload = () => resolve(element)
    element.onerror = () => resolve(null)
    element.src = url
  })

  if (!image) {
    URL.revokeObjectURL(url)
    return null
  }

  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    // URL zwalniamy dopiero po `drawImage` — wcześniej Safari potrafi zgubić bitmapę.
    release: () => URL.revokeObjectURL(url),
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: OutputType): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob && blob.type === type ? blob : null), type, ENCODE_QUALITY)
  })
}

/** `FileReader` zwraca `data:<type>;base64,<dane>` — kontrakt chce samych danych. */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('read failed'))
    reader.readAsDataURL(blob)
  })
}
