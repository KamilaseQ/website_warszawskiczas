'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
}

const CURTAIN_COVER_MS = 460
const CURTAIN_TOTAL_MS = 920
const CURTAIN_REVEAL_AFTER_ROUTE_MS = 520
// Pure safety net dla nawigacji która nigdy nie dochodzi do skutku (network fail,
// zerwana kompilacja w devie). Pierwsze wejście na route dynamiczny w devie potrafi
// trwać 3-4s przez kompilację Next.js — fallback MUSI być znacząco dłuższy, inaczej
// kurtyna otwiera się zanim pathname zdąży się zmienić i layoutEffect odpala drugi cykl.
const CURTAIN_FALLBACK_MS = 12000

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

// "Curtain" — cienka czarna zasłona zjeżdża z góry, kontent fade'uje pod spodem.
// Spójne z editorialną estetyką — bez efektu "bouncy" SPA.
export function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const [showCurtain, setShowCurtain] = useState(false)
  // 'animate' — panele wsuwają się z góry/dołu (klasyczna nawigacja przez klik).
  // 'instant' — panele są już w pełni rozłożone w momencie mounta (back/forward,
  //             gdzie nie możemy opóźnić przeglądarki — kurtyna musi już zakrywać).
  const [coverMode, setCoverMode] = useState<'animate' | 'instant'>('animate')
  const previousPathnameRef = useRef(pathname)
  const transitionIdRef = useRef(0)
  const showCurtainRef = useRef(false)
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // True dopóki nawigacja zainicjowana klikiem nie dotarła do nowego pathname.
  // Chroni przed drugim cyklem kurtyny gdyby fallback hide odpalił przed kompilacją.
  const userInitiatedRef = useRef(false)

  const setCurtain = (visible: boolean) => {
    showCurtainRef.current = visible
    setShowCurtain(visible)
    if (!visible) setCoverMode('animate')
  }

  const clearTimers = () => {
    if (pushTimerRef.current) clearTimeout(pushTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    pushTimerRef.current = null
    hideTimerRef.current = null
  }

  const scheduleHide = (transitionId: number, delay: number) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (transitionIdRef.current !== transitionId) return
      setCurtain(false)
    }, delay)
  }

  useEffect(() => {
    if (reducedMotion) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const nextUrl = new URL(anchor.href)
      if (nextUrl.origin !== window.location.origin) return
      if (!['http:', 'https:'].includes(nextUrl.protocol)) return

      const current = new URL(window.location.href)
      const samePage =
        nextUrl.pathname === current.pathname && nextUrl.search === current.search
      if (samePage) return

      event.preventDefault()
      // Bez tego next/link <Link> w fazie bubble odpala własny router.push natychmiast,
      // równolegle do naszego harmonogramu — pathname zmienia się zanim kurtyna zakryje
      // ekran i timing wszystkich efektów się rozjeżdża.
      event.stopPropagation()
      event.stopImmediatePropagation()

      const href = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
      userInitiatedRef.current = true

      // If a curtain is already showing or a navigation is mid-flight, push
      // immediately — never swallow the click silently.
      if (showCurtainRef.current) {
        clearTimers()
        const transitionId = transitionIdRef.current + 1
        transitionIdRef.current = transitionId
        router.push(href)
        scheduleHide(transitionId, CURTAIN_FALLBACK_MS)
        return
      }

      clearTimers()
      const transitionId = transitionIdRef.current + 1
      transitionIdRef.current = transitionId
      setCurtain(true)

      pushTimerRef.current = setTimeout(() => {
        if (transitionIdRef.current !== transitionId) return
        pushTimerRef.current = null
        router.push(href)
      }, CURTAIN_COVER_MS)
      scheduleHide(transitionId, CURTAIN_FALLBACK_MS)
    }

    // Browser back/forward — popstate fires *po* tym jak URL już się zmienił, ale
    // *przed* tym jak Next.js zdąży zaktualizować pathname i wyrenderować nową
    // stronę. Używamy flushSync, żeby kurtyna zamontowała się już w pełni
    // pokrywająca (coverMode='instant') zanim React zatwierdzi nową ścieżkę —
    // dzięki temu nigdy nie widać podmiany strony "przed kurtyną".
    const onPopState = () => {
      if (showCurtainRef.current) return
      const transitionId = transitionIdRef.current + 1
      transitionIdRef.current = transitionId
      flushSync(() => {
        setCoverMode('instant')
        showCurtainRef.current = true
        setShowCurtain(true)
      })
      // Safety: always release the curtain even if the route never settles.
      scheduleHide(transitionId, CURTAIN_FALLBACK_MS)
    }

    document.addEventListener('click', onClick, { capture: true })
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      window.removeEventListener('popstate', onPopState)
    }
  }, [router, reducedMotion])

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) {
      transitionIdRef.current += 1
      previousPathnameRef.current = pathname
      clearTimers()
      setCurtain(false)
      return
    }

    if (pathname === previousPathnameRef.current) return
    previousPathnameRef.current = pathname

    const transitionId = transitionIdRef.current + 1
    transitionIdRef.current = transitionId
    if (pushTimerRef.current) {
      clearTimeout(pushTimerRef.current)
      pushTimerRef.current = null
    }

    if (showCurtainRef.current) {
      scheduleHide(transitionId, CURTAIN_REVEAL_AFTER_ROUTE_MS)
    } else if (userInitiatedRef.current) {
      // Klik użytkownika zainicjował nawigację, ale kurtyna już zniknęła (np. fallback
      // hide odpalił podczas wolnej kompilacji w devie). Nie pokazuj jej drugi raz —
      // user już zobaczył pełen cykl, druga kurtyna byłaby błyskiem na nowej stronie.
    } else {
      // Pathname zmienił się bez naszego klika (programowe router.push, redirect z
      // form action itp.) — pokaż kurtynę, żeby zachować spójną estetykę przejść.
      setCurtain(true)
      scheduleHide(transitionId, CURTAIN_TOTAL_MS)
    }
    userInitiatedRef.current = false
  }, [pathname, reducedMotion])

  useEffect(() => {
    return () => {
      if (pushTimerRef.current) clearTimeout(pushTimerRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  if (reducedMotion) {
    return <>{children}</>
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.1 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showCurtain && (
          <div
            role="presentation"
            aria-hidden="true"
            data-wc-page-transition="curtain"
            className="fixed inset-0 z-[400] cursor-progress"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,98,0.055)_0%,transparent_32%)]" />

            {/* Top panel — slides down to cover top half (or starts already covering on back/forward) */}
            <motion.div
              initial={{ y: coverMode === 'instant' ? '0%' : '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: coverMode === 'instant' ? 0 : 0.42, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-x-0 top-0 h-1/2 bg-[#0a0a0a]"
            />

            {/* Bottom panel — slides up to cover bottom half (or starts already covering on back/forward) */}
            <motion.div
              initial={{ y: coverMode === 'instant' ? '0%' : '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: coverMode === 'instant' ? 0 : 0.42, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0a0a0a]"
            />

            {/* Split seam — leaves breathing room around the monogram */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.84 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.9 }}
              transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.14 }}
              className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2"
            >
              <span
                className="absolute left-0 h-px bg-gradient-to-r from-transparent via-accent-gold/45 to-accent-gold/10"
                style={{ right: 'calc(50% + 8.75rem)' }}
              />
              <span
                className="absolute right-0 h-px bg-gradient-to-l from-transparent via-accent-gold/45 to-accent-gold/10"
                style={{ left: 'calc(50% + 8.75rem)' }}
              />
            </motion.div>

            {/* Center logo flourish */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.36, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.18 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute h-[10.5rem] w-[10.5rem] rounded-full bg-[#0a0a0a] shadow-[0_0_54px_rgba(0,0,0,0.95)] sm:h-[12rem] sm:w-[12rem]" />

                {/* Pulsujący zewnętrzny pierścień */}
                <span className="absolute h-[184px] w-[184px] rounded-full border border-accent-gold/10 animate-[wc-pt-ring_1100ms_ease-out_infinite]" />

                {/* Bazowy pierścień wokół logo */}
                <span className="absolute h-[136px] w-[136px] rounded-full border border-accent-gold/24 shadow-[0_0_28px_rgba(201,169,98,0.06)] sm:h-[150px] sm:w-[150px]" />
                <span className="absolute h-[112px] w-[112px] rounded-full border border-accent-gold/8 sm:h-[124px] sm:w-[124px]" />

                {/* Kometa obiegająca pierścień — conic gradient z głową i ogonem, obracany */}
                <div
                  className="absolute h-[136px] w-[136px] rounded-full animate-[wc-pt-orbit_900ms_cubic-bezier(0.4,0,0.2,1)_forwards] sm:h-[150px] sm:w-[150px]"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(201,169,98,0.0) 292deg, rgba(201,169,98,0.34) 340deg, rgba(247,219,160,0.56) 358deg, rgba(255,240,202,0.5) 360deg)',
                    WebkitMask:
                      'radial-gradient(circle, transparent calc(50% - 2px), black calc(50% - 2px), black 50%, transparent 50%)',
                    mask: 'radial-gradient(circle, transparent calc(50% - 2px), black calc(50% - 2px), black 50%, transparent 50%)',
                    filter: 'drop-shadow(0 0 5px rgba(201,169,98,0.46))',
                  }}
                />

                {/* Logo bez shimmera — czyste */}
                <img
                  src="/logo_blank.png"
                  alt=""
                  aria-hidden="true"
                  className="relative h-14 w-auto drop-shadow-[0_0_16px_rgba(201,169,98,0.16)] sm:h-[4.5rem]"
                />
              </div>
            </motion.div>

            <style jsx>{`
              @keyframes wc-pt-ring {
                0% { transform: scale(0.85); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: scale(1.2); opacity: 0; }
              }
              @keyframes wc-pt-orbit {
                0% { transform: rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: rotate(360deg); opacity: 0; }
              }
            `}</style>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
