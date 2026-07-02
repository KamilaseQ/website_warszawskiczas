'use client'

import { useCallback, useEffect, useState } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { localeFromPathname, localizePath } from '@/lib/i18n'

/**
 * Baner zgód (RODO/ePrivacy) + GA4 — warstwowy, bez ramek, rozszerzalny.
 *
 * Warstwa 1 (pasek): „Zaakceptuj wszystkie” i „Zaakceptuj niezbędne” — dwa
 * równorzędne przyciski (ta sama wielkość/liczba kliknięć; „tylko niezbędne”
 * jest uznaną, równoprawną formą odmowy). „Ustawienia” otwiera warstwę 2.
 * Warstwa 2 (modal): przełączniki kategorii (Niezbędne = zawsze; Analityczne).
 *
 * REALNE działanie (nie placebo):
 *  - GA4 ładuje się TYLKO przy zgodzie na analitykę,
 *  - opt-out ustawia natychmiast flagę `ga-disable-<ID>` (także w tej sesji),
 *  - każda decyzja emituje event `wc-consent-change` + zapisuje `window.__wcConsent`,
 *    dzięki czemu KOLEJNE narzędzia (piksel, ads itd.) wpną się bez zmian tutaj —
 *    wystarczy dodać kategorię do `CATEGORIES` i nasłuchiwać eventu.
 *
 * Zmiana decyzji w każdej chwili: link „Ustawienia cookies” w stopce
 * (event `wc-open-cookie-settings`).
 */
const STORAGE_KEY = 'wc_cookie_consent'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-TQ11D4HYXZ'
const CONSENT_VERSION = 1

// Kategorie opcjonalne (bez „niezbędnych”, które są zawsze aktywne).
// Dodanie kolejnego narzędzia = dopisanie klucza tutaj + obsługa w consumerze.
const CATEGORIES = ['analytics'] as const
type Category = (typeof CATEGORIES)[number]
type Consent = Record<Category, boolean>

const ALL_ON: Consent = { analytics: true }
const ALL_OFF: Consent = { analytics: false }

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    if (raw === 'accepted') return { ...ALL_ON } // migracja starego formatu
    if (raw === 'rejected') return { ...ALL_OFF }
    const parsed = JSON.parse(raw) as Partial<Consent>
    return { analytics: parsed.analytics === true }
  } catch {
    return null
  }
}

function applyConsent(consent: Consent) {
  // Opt-out GA respektowany także w bieżącej sesji.
  ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = !consent.analytics
  ;(window as unknown as Record<string, Consent>).__wcConsent = consent
  window.dispatchEvent(new CustomEvent('wc-consent-change', { detail: consent }))
}

const COPY = {
  pl: {
    text: 'Używamy niezbędnych plików cookie, aby strona działała, oraz — za Twoją zgodą — analitycznych (Google Analytics), by rozumieć ruch na stronie.',
    more: 'Polityka prywatności',
    acceptAll: 'Zaakceptuj wszystkie',
    acceptNecessary: 'Zaakceptuj niezbędne',
    settings: 'Ustawienia',
    panelTitle: 'Ustawienia prywatności',
    panelIntro: 'Zdecyduj, które pliki cookie chcesz włączyć. Niezbędne są zawsze aktywne.',
    necessaryTitle: 'Niezbędne',
    necessaryDesc: 'Wymagane do działania strony i obsługi formularza kontaktowego.',
    analyticsTitle: 'Analityczne',
    analyticsDesc: 'Google Analytics 4 — anonimowe statystyki ruchu, pomagają ulepszać stronę.',
    always: 'Zawsze aktywne',
    save: 'Zapisz wybór',
    close: 'Zamknij',
  },
  en: {
    text: 'We use necessary cookies to run the site and, with your consent, analytics cookies (Google Analytics) to understand traffic.',
    more: 'Privacy policy',
    acceptAll: 'Accept all',
    acceptNecessary: 'Accept necessary',
    settings: 'Settings',
    panelTitle: 'Privacy settings',
    panelIntro: 'Choose which cookies to enable. Necessary cookies are always on.',
    necessaryTitle: 'Necessary',
    necessaryDesc: 'Required for the site to work and for the contact form.',
    analyticsTitle: 'Analytics',
    analyticsDesc: 'Google Analytics 4 — anonymous traffic statistics that help us improve.',
    always: 'Always on',
    save: 'Save choice',
    close: 'Close',
  },
  ua: {
    text: 'Ми використовуємо необхідні файли cookie для роботи сайту та — за вашою згодою — аналітичні (Google Analytics), щоб розуміти трафік.',
    more: 'Політика конфіденційності',
    acceptAll: 'Прийняти всі',
    acceptNecessary: 'Лише необхідні',
    settings: 'Налаштування',
    panelTitle: 'Налаштування приватності',
    panelIntro: 'Оберіть, які файли cookie увімкнути. Необхідні завжди активні.',
    necessaryTitle: 'Необхідні',
    necessaryDesc: 'Потрібні для роботи сайту та форми контакту.',
    analyticsTitle: 'Аналітичні',
    analyticsDesc: 'Google Analytics 4 — анонімна статистика трафіку, допомагає покращувати сайт.',
    always: 'Завжди активні',
    save: 'Зберегти вибір',
    close: 'Закрити',
  },
} as const

export function CookieConsent() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = COPY[locale]

  const [consent, setConsent] = useState<Consent | null>(null)
  const [ready, setReady] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [draftAnalytics, setDraftAnalytics] = useState(false)

  useEffect(() => {
    const stored = readConsent()
    setConsent(stored)
    if (stored) applyConsent(stored)
    setReady(true)
  }, [])

  useEffect(() => {
    const open = () => {
      setDraftAnalytics(readConsent()?.analytics ?? false)
      setModalOpen(true)
    }
    window.addEventListener('wc-open-cookie-settings', open)
    return () => window.removeEventListener('wc-open-cookie-settings', open)
  }, [])

  const persist = useCallback((value: Consent) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...value, v: CONSENT_VERSION, ts: new Date().toISOString() }),
      )
    } catch {
      // tryb prywatny — decyzja zostaje tylko w pamięci sesji
    }
    setConsent(value)
    applyConsent(value)
    setModalOpen(false)
  }, [])

  const openSettings = () => {
    setDraftAnalytics(consent?.analytics ?? false)
    setModalOpen(true)
  }

  const showBanner = ready && consent === null && !modalOpen
  const loadGa = ready && consent?.analytics === true

  const acceptAllBtn =
    'bg-accent-gold px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.25em] text-[#0a0a0a] transition-colors hover:bg-white'
  const secondaryBtn =
    'bg-white/10 px-6 py-2.5 font-sans text-[11px] uppercase tracking-[0.25em] text-white transition-colors hover:bg-white/20'

  return (
    <>
      {loadGa ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {/* Warstwa 1 — pasek (bez ramek; separacja miękkim cieniem) */}
      {showBanner ? (
        <div
          role="dialog"
          aria-label={t.panelTitle}
          className="fixed inset-x-0 bottom-0 z-[300] bg-[#0a0a0a]/95 shadow-[0_-8px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
            <p className="max-w-2xl text-sm leading-relaxed text-white/70">
              {t.text}{' '}
              <Link
                href={localizePath('/polityka-prywatnosci', locale)}
                className="underline underline-offset-2 transition-colors hover:text-accent-gold"
              >
                {t.more}
              </Link>
            </p>
            <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openSettings}
                className="font-sans text-[11px] uppercase tracking-[0.25em] text-white/60 underline underline-offset-4 transition-colors hover:text-white"
              >
                {t.settings}
              </button>
              <button type="button" onClick={() => persist(ALL_OFF)} className={secondaryBtn}>
                {t.acceptNecessary}
              </button>
              <button type="button" onClick={() => persist(ALL_ON)} className={acceptAllBtn}>
                {t.acceptAll}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Warstwa 2 — modal ustawień (bez ramek) */}
      {modalOpen ? (
        <div className="fixed inset-0 z-[310] flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label={t.close}
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.panelTitle}
            className="relative z-10 w-full max-w-lg bg-[#0a0a0a] p-6 text-white shadow-2xl sm:m-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                  {t.settings}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-medium">{t.panelTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label={t.close}
                className="inline-flex h-9 w-9 items-center justify-center bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-accent-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/60">{t.panelIntro}</p>

            <div className="mt-8 space-y-8">
              {/* Niezbędne — zawsze aktywne */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg">{t.necessaryTitle}</h3>
                  <p className="mt-1 text-sm text-white/55">{t.necessaryDesc}</p>
                </div>
                <span className="flex-shrink-0 font-sans text-[10px] uppercase tracking-[0.25em] text-accent-gold/80">
                  {t.always}
                </span>
              </div>

              {/* Analityczne — przełącznik (bez ramki) */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg">{t.analyticsTitle}</h3>
                  <p className="mt-1 text-sm text-white/55">{t.analyticsDesc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draftAnalytics}
                  aria-label={t.analyticsTitle}
                  onClick={() => setDraftAnalytics((v) => !v)}
                  className={`relative flex-shrink-0 h-6 w-11 rounded-full transition-colors ${
                    draftAnalytics ? 'bg-accent-gold' : 'bg-white/25'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#0a0a0a] transition-all ${
                      draftAnalytics ? 'left-[1.5rem]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => persist({ analytics: draftAnalytics })}
                className={secondaryBtn}
              >
                {t.save}
              </button>
              <button type="button" onClick={() => persist(ALL_ON)} className={acceptAllBtn}>
                {t.acceptAll}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
