'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { FormField } from './form-field'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { readSessionPath } from '@/components/session-tracker'
import { localizePath, type Locale } from '@/lib/i18n'

interface InquiryFormProps {
  subject?: string
  submitLabel?: string
  successMessage?: string
  locale?: Locale
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const copy = {
  pl: {
    defaultSubmit: 'Wyślij zapytanie',
    defaultSuccess: 'Dziękujemy za zapytanie. Skontaktujemy się wkrótce.',
    thanksTitle: 'Dziękujemy za wiadomość',
    urgent: 'W sprawach pilnych dzwoń:',
    errorFallback: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń: +48 604 50 1000.',
    connectionError: 'Brak połączenia. Sprawdź internet i spróbuj ponownie.',
    honeypot: 'Nie wypełniaj',
    name: 'Imię i nazwisko',
    namePlaceholder: 'Jan Kowalski',
    email: 'Email',
    emailPlaceholder: 'jan@example.com',
    phone: 'Telefon',
    details: 'Szczegóły zapytania',
    detailsPlaceholder: 'Opisz czego szukasz lub jakie masz pytanie...',
    consentPrefix: 'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie.',
    consentMiddle: 'Szczegóły w',
    privacy: 'polityce prywatności',
    submitting: 'Wysyłanie...',
  },
  en: {
    defaultSubmit: 'Send enquiry',
    defaultSuccess: 'Thank you for your enquiry. We will contact you shortly.',
    thanksTitle: 'Thank you for your message',
    urgent: 'For urgent matters call:',
    errorFallback: 'We could not send the message. Please try again or call: +48 604 50 1000.',
    connectionError: 'No connection. Check your internet connection and try again.',
    honeypot: 'Do not fill in',
    name: 'Full name',
    namePlaceholder: 'John Smith',
    email: 'Email',
    emailPlaceholder: 'john@example.com',
    phone: 'Phone',
    details: 'Enquiry details',
    detailsPlaceholder: 'Describe what you are looking for or what you would like to ask...',
    consentPrefix: 'I agree to the processing of my personal data in order to answer my enquiry.',
    consentMiddle: 'Details in the',
    privacy: 'privacy policy',
    submitting: 'Sending...',
  },
  ua: {
    defaultSubmit: 'Надіслати запит',
    defaultSuccess: 'Дякуємо за запит. Ми скоро зв’яжемося з вами.',
    thanksTitle: 'Дякуємо за повідомлення',
    urgent: 'У термінових питаннях телефонуйте:',
    errorFallback: 'Не вдалося надіслати повідомлення. Спробуйте ще раз або зателефонуйте: +48 604 50 1000.',
    connectionError: 'Немає з’єднання. Перевірте інтернет і спробуйте ще раз.',
    honeypot: 'Не заповнюйте',
    name: 'Ім’я та прізвище',
    namePlaceholder: 'Іван Петренко',
    email: 'Email',
    emailPlaceholder: 'ivan@example.com',
    phone: 'Телефон',
    details: 'Деталі запиту',
    detailsPlaceholder: 'Опишіть, що ви шукаєте або яке маєте питання...',
    consentPrefix: 'Я погоджуюся на обробку моїх персональних даних з метою відповіді на запит.',
    consentMiddle: 'Деталі в',
    privacy: 'політиці конфіденційності',
    submitting: 'Надсилання...',
  },
} satisfies Record<Locale, Record<string, string>>

export function InquiryForm({
  subject,
  submitLabel,
  successMessage,
  locale = 'pl',
}: InquiryFormProps) {
  const mountedAt = useRef<number>(Date.now())
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const t = copy[locale]

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const fd = new FormData(form)
    const details = String(fd.get('details') ?? '')
    const message = subject ? `[${subject}] ${details}` : details

    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message,
      rodo: fd.get('rodo') === 'on',
      company: String(fd.get('company') ?? ''),
      t: mountedAt.current,
      source: subject,
      sessionPath: readSessionPath(),
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatus('success')
        return
      }

      const data = await res.json().catch(() => ({}))
      setErrorMsg(typeof data?.error === 'string' ? data.error : t.errorFallback)
      setStatus('error')
    } catch {
      setErrorMsg(t.connectionError)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded border border-accent-gold/20 bg-accent-gold/5 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-accent-gold/50 bg-accent-gold/10">
          <Check className="h-5 w-5 text-accent-gold" />
        </div>
        <h3 className="mt-6 font-serif text-2xl font-medium italic text-foreground">
          {t.thanksTitle}
        </h3>
        <div className="mx-auto mt-4 h-px w-12 bg-accent-gold/60" />
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          {successMessage ?? t.defaultSuccess}
          <br />
          {t.urgent}{' '}
          <a href="tel:+48604501000" className="whitespace-nowrap text-accent-gold">
            +48 604 50 1000
          </a>
          .
        </p>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          {t.honeypot}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label={t.name} name="name" type="text" placeholder={t.namePlaceholder} required />
        <FormField label={t.email} name="email" type="email" placeholder={t.emailPlaceholder} required />
      </div>
      <FormField label={t.phone} name="phone" type="tel" placeholder="+48 604 50 1000" required />
      <FormField
        as="textarea"
        label={t.details}
        name="details"
        placeholder={t.detailsPlaceholder}
        required
      />

      <label className="flex cursor-pointer select-none items-start gap-3">
        <input type="checkbox" required name="rodo" className="mt-1 h-4 w-4 flex-shrink-0 accent-accent-gold" />
        <span className="font-sans text-xs leading-relaxed text-muted-foreground text-pretty">
          {t.consentPrefix}{' '}
          {t.consentMiddle}{' '}
          <a href={localizePath('/polityka-prywatnosci', locale)} target="_blank" rel="noopener" className="text-accent-gold underline">
            {t.privacy}
          </a>
          . *
        </span>
      </label>

      {status === 'error' && errorMsg && (
        <div role="alert" className={cn('border-l-2 border-red-500/70 bg-red-50 px-4 py-3 text-sm text-red-800')}>
          {errorMsg}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? t.submitting : (submitLabel ?? t.defaultSubmit)}
      </Button>
    </form>
  )
}
