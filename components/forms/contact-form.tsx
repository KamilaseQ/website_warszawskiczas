'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { readSessionPath } from '@/components/session-tracker'
import { clearContactSource, readContactSource } from '@/components/contact-link'
import { localizePath, type Locale } from '@/lib/i18n'

interface ContactFormProps {
  variant?: 'light' | 'dark'
  locale?: Locale
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const copy = {
  pl: {
    thanksTitle: 'Dziękujemy za wiadomość',
    thanksText: 'Odpowiadamy w ciągu 24 godzin w dni robocze.',
    urgent: 'W sprawach pilnych dzwoń na',
    errorFallback: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń: +48 604 50 1000.',
    connectionError: 'Brak połączenia. Sprawdź internet i spróbuj ponownie.',
    honeypot: 'Nie wypełniaj tego pola',
    name: 'Imię i nazwisko *',
    email: 'E-mail *',
    phone: 'Numer telefonu *',
    message: 'Wiadomość *',
    messagePlaceholder: 'Opisz, w czym możemy pomóc...',
    consent:
      'Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w formularzu w celu odpowiedzi na zapytanie. *',
    dataInfo: 'Informacja o przetwarzaniu danych',
    dataP1:
      'Administratorem Twoich danych jest butik Warszawski Czas, ul. Mokotowska 71, 00-530 Warszawa. Dane przetwarzamy w celu udzielenia odpowiedzi na zapytanie złożone przez formularz, na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO) oraz w celu podjęcia działań na Twoje żądanie (art. 6 ust. 1 lit. b RODO).',
    dataP2:
      'Dane przechowujemy przez okres niezbędny do prowadzenia korespondencji i obsługi sprawy, z uwzględnieniem obowiązujących przepisów prawa. Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, sprzeciwu, przenoszenia oraz cofnięcia zgody w dowolnym momencie, a także wniesienia skargi do PUODO.',
    dataP3Prefix: 'Pełne informacje znajdziesz w',
    privacy: 'polityce prywatności',
    submitting: 'Wysyłanie...',
    submit: 'Wyślij wiadomość',
    responseTime: 'Odpowiadamy w ciągu 24 godzin.',
    urgentShort: 'W sprawach pilnych:',
  },
  en: {
    thanksTitle: 'Thank you for your message',
    thanksText: 'We usually respond within 24 hours on business days.',
    urgent: 'For urgent matters call',
    errorFallback: 'We could not send the message. Please try again or call: +48 604 50 1000.',
    connectionError: 'No connection. Check your internet connection and try again.',
    honeypot: 'Do not fill in this field',
    name: 'Full name *',
    email: 'E-mail *',
    phone: 'Phone number *',
    message: 'Message *',
    messagePlaceholder: 'Tell us how we can help...',
    consent: 'I agree to the processing of my personal data provided in the form in order to answer my enquiry. *',
    dataInfo: 'Data processing information',
    dataP1:
      'The controller of your data is Warszawski Czas boutique, ul. Mokotowska 71, 00-530 Warsaw. We process the data to answer the enquiry submitted through the form, based on your consent and to take steps at your request.',
    dataP2:
      'We store the data for the period necessary to handle correspondence and the matter, subject to applicable law. You have the right to access, correct, delete, restrict processing, object, transfer data and withdraw consent at any time.',
    dataP3Prefix: 'Full information is available in the',
    privacy: 'privacy policy',
    submitting: 'Sending...',
    submit: 'Send message',
    responseTime: 'We respond within 24 hours.',
    urgentShort: 'Urgent matters:',
  },
  ua: {
    thanksTitle: 'Дякуємо за повідомлення',
    thanksText: 'Зазвичай ми відповідаємо протягом 24 годин у робочі дні.',
    urgent: 'У термінових питаннях телефонуйте',
    errorFallback: 'Не вдалося надіслати повідомлення. Спробуйте ще раз або зателефонуйте: +48 604 50 1000.',
    connectionError: 'Немає з’єднання. Перевірте інтернет і спробуйте ще раз.',
    honeypot: 'Не заповнюйте це поле',
    name: 'Ім’я та прізвище *',
    email: 'E-mail *',
    phone: 'Номер телефону *',
    message: 'Повідомлення *',
    messagePlaceholder: 'Опишіть, як ми можемо допомогти...',
    consent: 'Я погоджуюся на обробку моїх персональних даних, указаних у формі, з метою відповіді на запит. *',
    dataInfo: 'Інформація про обробку даних',
    dataP1:
      'Адміністратором ваших даних є бутік Warszawski Czas, ul. Mokotowska 71, 00-530 Warszawa. Ми обробляємо дані, щоб відповісти на запит, надісланий через форму, на підставі вашої згоди та для виконання дій на ваш запит.',
    dataP2:
      'Ми зберігаємо дані протягом періоду, необхідного для ведення листування та обслуговування справи, з урахуванням чинного законодавства. Ви маєте право на доступ, виправлення, видалення, обмеження обробки, заперечення, перенесення даних і відкликання згоди.',
    dataP3Prefix: 'Повна інформація доступна в',
    privacy: 'політиці конфіденційності',
    submitting: 'Надсилання...',
    submit: 'Надіслати повідомлення',
    responseTime: 'Ми відповідаємо протягом 24 годин.',
    urgentShort: 'Термінові питання:',
  },
} satisfies Record<Locale, Record<string, string>>

export function ContactForm({ variant = 'light', locale = 'pl' }: ContactFormProps) {
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

    const tracked = readContactSource()
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message: String(fd.get('message') ?? ''),
      rodo: fd.get('rodo') === 'on',
      company: String(fd.get('company') ?? ''),
      t: mountedAt.current,
      source: tracked.source,
      product: tracked.product,
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
        clearContactSource()
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

  const isDark = variant === 'dark'

  if (status === 'success') {
    return (
      <div className={cn('p-10 text-center', isDark ? 'bg-[#0a0a0a] text-white' : 'bg-background')}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-accent-gold/50 bg-accent-gold/10">
          <Check className="h-5 w-5 text-accent-gold" />
        </div>
        <h3 className="mt-6 font-serif text-2xl font-medium italic">{t.thanksTitle}</h3>
        <div className="mx-auto mt-4 h-px w-12 bg-accent-gold/60" />
        <p className={cn('mx-auto mt-6 max-w-md text-sm leading-relaxed text-pretty', isDark ? 'text-white/60' : 'text-muted-foreground')}>
          {t.thanksText}
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

  const labelClass = cn(
    'mb-2 block text-[10px] font-sans font-bold uppercase tracking-[0.35em]',
    isDark ? 'text-white/60' : 'text-muted-foreground',
  )
  const inputClass = cn(
    'block w-full border px-4 py-3 font-sans text-sm focus:outline-none focus:ring-0',
    isDark
      ? 'border-white/20 bg-transparent text-white placeholder:text-white/30 focus:border-accent-gold'
      : 'border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:border-accent-gold',
  )

  const submitting = status === 'submitting'

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          {t.honeypot}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cf-name">{t.name}</label>
          <input id="cf-name" name="name" type="text" required maxLength={100} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="cf-email">{t.email}</label>
          <input id="cf-email" name="email" type="email" required maxLength={150} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="cf-phone">{t.phone}</label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          required
          maxLength={30}
          pattern="[+\d\s\-()]+"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="cf-message">{t.message}</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          placeholder={t.messagePlaceholder}
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer select-none items-start gap-3">
          <input type="checkbox" required name="rodo" className="mt-1 h-4 w-4 flex-shrink-0 accent-accent-gold" />
          <span className={cn('font-sans text-xs leading-relaxed text-pretty', isDark ? 'text-white/50' : 'text-muted-foreground')}>
            {t.consent}
          </span>
        </label>

        <details className={cn('group border-l-2 pl-4 text-xs', isDark ? 'border-white/15' : 'border-border')}>
          <summary
            className={cn(
              'cursor-pointer select-none font-sans text-[10px] uppercase tracking-[0.3em] transition-colors hover:text-accent-gold',
              isDark ? 'text-white/40' : 'text-muted-foreground/70',
            )}
          >
            {t.dataInfo}
          </summary>
          <div className={cn('mt-3 space-y-2 font-sans leading-relaxed text-pretty', isDark ? 'text-white/50' : 'text-muted-foreground')}>
            <p>{t.dataP1}</p>
            <p>{t.dataP2}</p>
            <p>
              {t.dataP3Prefix}{' '}
              <a
                href={localizePath('/polityka-prywatnosci', locale)}
                target="_blank"
                rel="noopener"
                className="text-accent-gold underline"
              >
                {t.privacy}
              </a>
              .
            </p>
          </div>
        </details>
      </div>

      {status === 'error' && errorMsg && (
        <div
          role="alert"
          className={cn(
            'border-l-2 border-red-500/70 px-4 py-3 text-sm',
            isDark ? 'bg-red-500/10 text-red-200' : 'bg-red-50 text-red-800',
          )}
        >
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={cn('w-full', isDark ? 'btn-premium-white' : 'btn-sharp', submitting && 'cursor-wait opacity-70')}
        style={{ display: 'block' }}
      >
        {submitting ? t.submitting : t.submit}
      </button>

      <p className={cn('text-center text-[10px] uppercase tracking-[0.3em]', isDark ? 'text-white/40' : 'text-muted-foreground/60')}>
        {t.responseTime}
        <br />
        {t.urgentShort}{' '}
        <a href="tel:+48604501000" className="whitespace-nowrap text-accent-gold">+48 604 50 1000</a>
      </p>
    </form>
  )
}
