'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { localeFromPathname } from '@/lib/i18n'

// Cel: gdy strona ładuje się błyskawicznie → cała animacja w ~1s.
// Gdy strona ładuje się dłużej → wskazówka pełznie wolniej, ale ZAWSZE
// kończy dokładnie jeden obrót (nigdy drugi, nigdy ucięty).
const FAST_TOTAL_MS = 1000 // minimalny łączny czas animacji
const POST_LOAD_BUFFER_MS = 200 // ile zostawiamy po `load` na dokończenie obrotu
const PESSIMISTIC_DURATION_MS = 5000 // wskazówka osiąga 92% w tym czasie jeśli `load` nie wystrzelił
const HARD_TIMEOUT_MS = 8000 // bezwzględny fallback gdyby `load` nigdy nie poleciał

export function LoadingScreen() {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const [hidden, setHidden] = useState(false)
  const [fading, setFading] = useState(false)
  const [angle, setAngle] = useState(0)

  useEffect(() => {
    const markFinished = () => {
      ;(window as unknown as { __wcLoadingFinished?: boolean }).__wcLoadingFinished = true
      window.dispatchEvent(new Event('wc-loading-finish'))
    }

    if (sessionStorage.getItem('wc-loaded') === '1') {
      setHidden(true)
      markFinished()
      return
    }

    const start = performance.now()
    let loadElapsed: number | null = document.readyState === 'complete' ? 0 : null
    let finished = false
    let rafId = 0

    const onLoad = () => {
      if (loadElapsed === null) loadElapsed = performance.now() - start
    }
    if (loadElapsed === null) window.addEventListener('load', onLoad, { once: true })

    const hardTimer = window.setTimeout(() => {
      if (loadElapsed === null) loadElapsed = performance.now() - start
    }, HARD_TIMEOUT_MS)

    const tick = (now: number) => {
      if (finished) return
      const elapsed = now - start

      // Dynamicznie wyliczany całkowity czas trwania:
      // — jeśli strona już gotowa, dążymy do FAST_TOTAL_MS lub loadElapsed + buffer (cokolwiek dłuższe)
      // — jeśli jeszcze nie, animacja pełznie wg pesymistycznego budżetu i nie pozwalamy jej skończyć obrotu
      const totalDuration =
        loadElapsed !== null
          ? Math.max(FAST_TOTAL_MS, loadElapsed + POST_LOAD_BUFFER_MS)
          : PESSIMISTIC_DURATION_MS

      let t = elapsed / totalDuration
      // Bez `load` — trzymamy wskazówkę przed metą (max 92%), żeby nie wlecieć w drugi obrót
      if (loadElapsed === null) t = Math.min(t, 0.92)
      else t = Math.min(t, 1)

      setAngle(t * 360)

      if (loadElapsed !== null && t >= 1) {
        finished = true
        sessionStorage.setItem('wc-loaded', '1')
        markFinished()
        window.setTimeout(() => setFading(true), 80)
        window.setTimeout(() => setHidden(true), 880)
        return
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(hardTimer)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  if (hidden) return null

  const ticks = Array.from({ length: 60 }, (_, i) => i)
  // Indeksy zapalają się tak jak je mija wskazówka
  const litTicks = Math.floor((angle / 360) * 60)

  return (
    <>
      <noscript>
        <style>{`
          .wc-loading-screen {
            display: none !important;
          }
        `}</style>
      </noscript>
      <div
        aria-hidden="true"
        role="status"
        className={`wc-loading-screen fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-[800ms] ease-in-out ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
      {/* Ciepła złota poświata */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,98,0.10)_0%,transparent_55%)]" />

      {/* Ziarno */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Crop marks */}
      <span aria-hidden className="pointer-events-none absolute left-8 top-8 h-5 w-5">
        <span className="absolute left-0 top-0 h-px w-5 bg-accent-gold/60" />
        <span className="absolute left-0 top-0 h-5 w-px bg-accent-gold/60" />
      </span>
      <span aria-hidden className="pointer-events-none absolute right-8 top-8 h-5 w-5">
        <span className="absolute right-0 top-0 h-px w-5 bg-accent-gold/60" />
        <span className="absolute right-0 top-0 h-5 w-px bg-accent-gold/60" />
      </span>
      <span aria-hidden className="pointer-events-none absolute left-8 bottom-8 h-5 w-5">
        <span className="absolute left-0 bottom-0 h-px w-5 bg-accent-gold/60" />
        <span className="absolute left-0 bottom-0 h-5 w-px bg-accent-gold/60" />
      </span>
      <span aria-hidden className="pointer-events-none absolute right-8 bottom-8 h-5 w-5">
        <span className="absolute right-0 bottom-0 h-px w-5 bg-accent-gold/60" />
        <span className="absolute right-0 bottom-0 h-5 w-px bg-accent-gold/60" />
      </span>

      <div className="relative flex flex-col items-center gap-10">
        {/* Tarcza */}
        <div className="relative h-[440px] w-[440px] sm:h-[520px] sm:w-[520px]">
          <span className="absolute inset-0 rounded-full border border-accent-gold/15" />
          <span className="absolute inset-[14px] rounded-full border border-accent-gold/10" />

          {/* 60 indeksów */}
          {ticks.map((i) => {
            const tickAngle = i * 6
            const isHour = i % 5 === 0
            const lit = i < litTicks
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${tickAngle}deg) translateY(calc(-50% - 222px))`,
                  transformOrigin: 'center center',
                  width: isHour ? '1.5px' : '1px',
                  height: isHour ? '18px' : '8px',
                  marginLeft: isHour ? '-0.75px' : '-0.5px',
                  marginTop: isHour ? '-9px' : '-4px',
                  backgroundColor: lit
                    ? 'rgb(201 169 98)'
                    : isHour
                      ? 'rgba(255,255,255,0.22)'
                      : 'rgba(255,255,255,0.08)',
                  boxShadow: lit ? '0 0 8px rgba(201,169,98,0.7)' : 'none',
                  transition: 'background-color 120ms ease-out, box-shadow 120ms ease-out',
                }}
              />
            )
          })}

          {/* Cyfry rzymskie */}
          <span className="absolute left-1/2 top-[42px] -translate-x-1/2 font-serif text-xs tracking-[0.3em] text-white/35 sm:text-sm">
            XII
          </span>
          <span className="absolute right-[34px] top-1/2 -translate-y-1/2 font-serif text-xs tracking-[0.2em] text-white/35 sm:text-sm">
            III
          </span>
          <span className="absolute bottom-[42px] left-1/2 -translate-x-1/2 font-serif text-xs tracking-[0.3em] text-white/35 sm:text-sm">
            VI
          </span>
          <span className="absolute left-[34px] top-1/2 -translate-y-1/2 font-serif text-xs tracking-[0.2em] text-white/35 sm:text-sm">
            IX
          </span>

          {/* Logo na tarczy — printowany blok marki */}
          <div
            className="absolute inset-x-0 top-[26%] flex flex-col items-center gap-2"
            style={{
              opacity: 0,
              animation: 'wc-loading-fade-in 700ms ease-out 200ms forwards',
            }}
          >
            <img
              src="/logo_blank.png"
              alt="Warszawski Czas"
              className="block h-12 w-auto sm:h-14"
            />
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-accent-gold/40" />
              <span className="font-serif italic text-[10px] tracking-[0.25em] text-white/40 sm:text-[11px]">
                Mokotowska 71
              </span>
              <span className="h-px w-6 bg-accent-gold/40" />
            </div>
          </div>

          {/* Wskazówka — driven by React state, jeden obrót, brak skoków */}
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              height: '210px',
              width: '2px',
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
              willChange: 'transform',
            }}
          >
            <div className="relative h-full w-full">
              <span className="absolute inset-x-0 top-0 bottom-2 bg-gradient-to-t from-accent-gold via-accent-gold to-accent-gold/0" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-accent-gold shadow-[0_0_14px_rgba(201,169,98,0.9)]" />
            </div>
          </div>

          {/* Centralny pin */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-accent-gold shadow-[0_0_14px_rgba(201,169,98,0.8)] z-10" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#0a0a0a] z-20" />
        </div>

        {/* Pod zegarem */}
        <div
          className="flex flex-col items-center gap-2"
          style={{
            opacity: 0,
            animation: 'wc-loading-fade-in 700ms ease-out 300ms forwards',
          }}
        >
          <span className="font-sans text-[9px] font-bold uppercase tracking-[0.5em] text-white/40">
            {locale === 'pl' ? 'Ładowanie strony' : locale === 'en' ? 'Loading page' : 'Завантаження сторінки'}
          </span>
          <span className="font-serif text-base tracking-[0.35em] text-accent-gold/85 sm:text-lg">
            WARSZAWSKI CZAS
          </span>
        </div>
      </div>
      </div>
    </>
  )
}
