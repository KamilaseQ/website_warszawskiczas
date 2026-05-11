'use client'

import { useEffect, useRef, useState } from 'react'
import { Container, Section } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { readSessionPath } from '@/components/session-tracker'
import type { Locale } from '@/lib/i18n'

const copy = {
  pl: {
    eyebrow: 'Poproś o dostęp',
    h2a: 'Uzyskaj dostęp',
    h2b: 'do Kolekcji Prywatnej',
    lead:
      'Zostaw kontakt — specjalista oddzwoni i po krótkiej rozmowie przekaże indywidualny kod dostępu. Możesz też zadzwonić bezpośrednio.',
    benefits: [
      { numeral: 'I', text: 'Dostęp do zegarków poza katalogiem butiku' },
      { numeral: 'II', text: 'Indywidualna konsultacja ze specjalistą' },
      { numeral: 'III', text: 'Bezpieczna, poufna transakcja' },
    ],
    fName: 'Imię i nazwisko *',
    fEmail: 'E-mail *',
    fPhone: 'Numer telefonu *',
    fMessage: 'Powiedz nam coś o sobie',
    fMessagePh: 'Np. jaki typ zegarków Cię interesuje, jaki mniej więcej budżet...',
    rodo:
      'Wyrażam zgodę na przetwarzanie danych osobowych w celu odpowiedzi na zapytanie. *',
    submit: 'Wyślij zapytanie',
    submitting: 'Wysyłanie...',
    response: 'Odpowiadamy w ciągu 24 godzin',
    successTitle: 'Twoja wiadomość dotarła',
    successBody:
      'Specjalista skontaktuje się z Tobą w ciągu 24 godzin na podany numer lub e-mail. Kod dostępu zostanie przekazany po krótkiej rozmowie.',
    since: 'Warszawski Czas  ·  od 2019',
    fallbackError:
      'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń: +48 604 50 1000.',
    networkError: 'Brak połączenia. Sprawdź internet i spróbuj ponownie.',
    aboutFallback: 'Prośba o dostęp do kolekcji prywatnej.',
    honeyLabel: 'Nie wypełniaj',
  },
  en: {
    eyebrow: 'Request access',
    h2a: 'Get access',
    h2b: 'to the Private Collection',
    lead:
      'Leave your contact details — our specialist will call back and, after a short conversation, send you an individual access code. You can also call us directly.',
    benefits: [
      { numeral: 'I', text: 'Access to watches outside the boutique catalogue' },
      { numeral: 'II', text: 'Personal consultation with a specialist' },
      { numeral: 'III', text: 'Secure, confidential transaction' },
    ],
    fName: 'Full name *',
    fEmail: 'E-mail *',
    fPhone: 'Phone number *',
    fMessage: 'Tell us something about yourself',
    fMessagePh: 'For example what kind of watches interest you, your approximate budget...',
    rodo:
      'I consent to my personal data being processed in order to respond to my enquiry. *',
    submit: 'Send enquiry',
    submitting: 'Sending...',
    response: 'Reply within 24 hours',
    successTitle: 'Your message arrived',
    successBody:
      'Our specialist will contact you within 24 hours via the number or email provided. The access code is passed on after a short conversation.',
    since: 'Warszawski Czas  ·  since 2019',
    fallbackError:
      'Could not send the message. Please try again or call: +48 604 50 1000.',
    networkError: 'No connection. Check your network and try again.',
    aboutFallback: 'Private Collection access request.',
    honeyLabel: 'Do not fill in',
  },
  ua: {
    eyebrow: 'Запит доступу',
    h2a: 'Отримати доступ',
    h2b: 'до Приватної колекції',
    lead:
      'Залиште контакти — спеціаліст передзвонить і після короткої розмови надішле індивідуальний код доступу. Можна також зателефонувати напряму.',
    benefits: [
      { numeral: 'I', text: 'Доступ до годинників поза каталогом бутіка' },
      { numeral: 'II', text: 'Індивідуальна консультація зі спеціалістом' },
      { numeral: 'III', text: 'Безпечна, конфіденційна угода' },
    ],
    fName: 'Ім’я та прізвище *',
    fEmail: 'E-mail *',
    fPhone: 'Номер телефону *',
    fMessage: 'Розкажіть про себе',
    fMessagePh: 'Наприклад, які годинники цікавлять, орієнтовний бюджет...',
    rodo:
      'Надаю згоду на обробку персональних даних з метою відповіді на запит. *',
    submit: 'Надіслати запит',
    submitting: 'Надсилання...',
    response: 'Відповідаємо протягом 24 годин',
    successTitle: 'Ваше повідомлення надійшло',
    successBody:
      'Спеціаліст зв’яжеться з вами протягом 24 годин за вказаним номером або e-mail. Код доступу передаємо після короткої розмови.',
    since: 'Warszawski Czas  ·  з 2019',
    fallbackError:
      'Не вдалося надіслати повідомлення. Спробуйте ще раз або зателефонуйте: +48 604 50 1000.',
    networkError: 'Немає з’єднання. Перевірте інтернет і спробуйте знову.',
    aboutFallback: 'Запит доступу до приватної колекції.',
    honeyLabel: 'Не заповнюйте',
  },
} as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function PrivateCollectionRegistration({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = copy[locale]
  const mountedAt = useRef<number>(Date.now())
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

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
    const aboutMe = String(fd.get('message') ?? '').trim()
    const message = aboutMe.length > 0
      ? `[Kolekcja Prywatna] ${aboutMe}`
      : `[Kolekcja Prywatna] ${t.aboutFallback}`

    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      message,
      rodo: fd.get('rodo') === 'on',
      company: String(fd.get('company') ?? ''),
      t: mountedAt.current,
      source: 'kolekcja-prywatna',
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
      setErrorMsg(typeof data?.error === 'string' ? data.error : t.fallbackError)
      setStatus('error')
    } catch {
      setErrorMsg(t.networkError)
      setStatus('error')
    }
  }

  return (
    <Section
      id="registration"
      spacing="xl"
      className="relative overflow-hidden bg-[#050403] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_25%,rgba(201,169,98,0.1)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_90%,rgba(201,169,98,0.06)_0%,transparent_55%)]" />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            <FadeIn>
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-accent-gold/60" />
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold">
                  {t.eyebrow}
                </p>
              </div>
              <h2 className="mt-8 font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-[2.75rem] text-balance leading-[1.05]">
                {t.h2a}<br />
                <span className="italic font-normal">{t.h2b}</span>
              </h2>
              <p className="mt-8 max-w-md font-sans text-[15px] leading-relaxed text-white/55 text-pretty">
                {t.lead}
              </p>
              <div className="mt-8 font-serif text-2xl text-accent-gold/55 leading-none">· · ·</div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <ul className="mt-10 space-y-5">
                {t.benefits.map((b) => (
                  <li key={b.numeral} className="flex items-baseline gap-5">
                    <span className="font-serif italic text-base text-accent-gold/70" style={{ minWidth: '2ch', letterSpacing: '0.05em' }}>
                      {b.numeral}
                    </span>
                    <span className="font-sans text-sm leading-relaxed text-white/75">
                      {b.text}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn delay={0.15}>
              <div className="relative">
                <div className="pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full border border-accent-gold/30 lg:block" />
                <div className="pointer-events-none absolute -top-4 -left-4 hidden h-full w-full border border-accent-gold/15 lg:block" />

                <div className="relative bg-[#0a0a0a] p-8 lg:p-12">
                  <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-accent-gold/60 to-transparent" />

                  {status === 'success' ? (
                    <SuccessState t={t} />
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-7">
                      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                        <label>
                          {t.honeyLabel}
                          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
                        </label>
                      </div>

                      <div className="grid gap-7 sm:grid-cols-2">
                        <Field label={t.fName} name="name" required />
                        <Field label={t.fEmail} name="email" type="email" required />
                      </div>

                      <div>
                        <Field label={t.fPhone} name="phone" type="tel" required />
                      </div>

                      <div>
                        <label className="mb-3 block text-[10px] font-sans font-bold uppercase tracking-[0.35em] text-white/60">
                          {t.fMessage}
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          maxLength={2000}
                          placeholder={t.fMessagePh}
                          className="block w-full resize-none border-b border-white/25 bg-transparent px-0 py-2 font-sans text-sm italic text-white placeholder:italic placeholder:text-white/30 focus:border-accent-gold focus:outline-none focus:ring-0"
                        />
                      </div>

                      <label className="flex items-start gap-3 cursor-pointer select-none pt-2">
                        <input
                          type="checkbox"
                          required
                          name="rodo"
                          className="mt-1 h-4 w-4 flex-shrink-0 accent-accent-gold"
                        />
                        <span className="font-sans text-xs leading-relaxed text-white/45 text-pretty">
                          {t.rodo}
                        </span>
                      </label>

                      {status === 'error' && errorMsg && (
                        <div role="alert" className="border-l-2 border-red-500/70 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="btn-premium-white w-full"
                        style={{ display: 'block' }}
                      >
                        {status === 'submitting' ? t.submitting : t.submit}
                      </button>

                      <p className="text-center font-sans text-[10px] uppercase tracking-[0.4em] text-white/35">
                        {t.response}
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </Section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-3 block text-[10px] font-sans font-bold uppercase tracking-[0.35em] text-white/60">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="block w-full border-b border-white/25 bg-transparent px-0 py-2 font-sans text-sm text-white placeholder:text-white/30 focus:border-accent-gold focus:outline-none focus:ring-0"
      />
    </div>
  )
}

function SuccessState({ t }: { t: (typeof copy)[Locale] }) {
  return (
    <div className="text-center py-8">
      <h3 className="font-serif text-2xl font-medium italic text-white sm:text-3xl">
        {t.successTitle}
      </h3>
      <div className="mx-auto mt-5 h-px w-12 bg-accent-gold/60" />
      <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-white/55 text-pretty">
        {t.successBody}
      </p>
      <p className="mt-10 font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold/70">
        {t.since}
      </p>
    </div>
  )
}
