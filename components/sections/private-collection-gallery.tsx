'use client'

import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { Container, Section, ImagePlaceholder } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { cn } from '@/lib/utils'

type Item = {
  num: string
  ref: string
  year: string
  condition: string
  status: 'Dostępny' | 'Zarezerwowany'
  revealAlways?: boolean
}

const items: Item[] = [
  { num: '001', ref: 'Ref. 5711', year: '2019', condition: 'Stan kolekcjonerski', status: 'Zarezerwowany', revealAlways: true },
  { num: '002', ref: 'Ref. 116500LN', year: '2020', condition: 'Jak nowy', status: 'Dostępny', revealAlways: true },
  { num: '003', ref: 'Ref. 15202ST', year: '2017', condition: 'Bardzo dobry', status: 'Dostępny' },
  { num: '004', ref: 'Ref. 15500ST', year: '2022', condition: 'Stan kolekcjonerski', status: 'Dostępny' },
  { num: '005', ref: 'Ref. 5167A', year: '2018', condition: 'Jak nowy', status: 'Zarezerwowany' },
  { num: '006', ref: 'Ref. 116710BLNR', year: '2016', condition: 'Stan kolekcjonerski', status: 'Dostępny' },
]

export function PrivateCollectionGallery() {
  const [unlocked, setUnlocked] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/private-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.ok) {
        setUnlocked(true)
        setError(false)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById('registration')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section variant="muted" spacing="lg">
      <Container>
        <FadeIn>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-accent-gold mb-4">
                Galeria
              </p>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl text-balance">
                Kilka pozycji odkrywamy.<br />
                <span className="italic font-normal">Reszta czeka za kodem.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
              Aktualnie dostępnych: <span className="font-serif text-foreground">{items.length} pozycji</span>.
              Pełna lista widoczna po wpisaniu indywidualnego kodu dostępu.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Galeria */}
          <div className="lg:col-span-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it, i) => {
                const isVisible = unlocked || it.revealAlways
                return (
                  <FadeIn key={it.num} delay={i * 0.05}>
                    <div className="group relative">
                      {/* Badge "No. XXX" */}
                      <div className="absolute left-0 top-0 z-10 bg-[#0a0a0a] px-3 py-1.5">
                        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-accent-gold">
                          No. {it.num}
                        </span>
                      </div>

                      <div className="relative aspect-[3/4] overflow-hidden">
                        <ImagePlaceholder
                          className={cn(
                            'absolute inset-0 transition-all duration-700',
                            !isVisible && 'blur-xl scale-110 opacity-70'
                          )}
                          variant={isVisible ? 'light' : 'dark'}
                          label=""
                          showDial={isVisible}
                        />

                        {!isVisible && (
                          <>
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-14 w-14 items-center justify-center border border-accent-gold/60 bg-black/50">
                                <Lock className="h-5 w-5 text-accent-gold/80" />
                              </div>
                            </div>
                          </>
                        )}

                        {/* Status badge */}
                        <div className="absolute right-0 top-0 bg-[#0a0a0a] px-3 py-1.5">
                          <span
                            className={cn(
                              'font-sans text-[9px] font-bold uppercase tracking-[0.3em]',
                              it.status === 'Dostępny' ? 'text-accent-gold' : 'text-white/40'
                            )}
                          >
                            {it.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        {isVisible ? (
                          <>
                            <p className="font-serif text-lg font-medium text-foreground">
                              {it.ref}
                            </p>
                            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                              {it.year} · {it.condition}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-serif text-lg italic font-normal text-muted-foreground">
                              Zastrzeżone
                            </p>
                            <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                              Dostęp z kodem
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                )
              })}
            </div>
          </div>

          {/* Panel odblokowania */}
          <div className="lg:col-span-4">
            <FadeIn delay={0.1}>
              <div className="sticky top-28 bg-[#0a0a0a] p-8 text-white lg:p-10">
                <div className="flex items-center gap-3">
                  {unlocked ? (
                    <Unlock className="h-5 w-5 text-accent-gold" />
                  ) : (
                    <Lock className="h-5 w-5 text-accent-gold" />
                  )}
                  <p className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-accent-gold">
                    {unlocked ? 'Odblokowano' : 'Kod dostępu'}
                  </p>
                </div>

                <h3 className="mt-6 font-serif text-2xl font-medium text-white leading-tight">
                  {unlocked ? 'Witamy w kolekcji prywatnej' : 'Odblokuj pełną kolekcję'}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-white/50 text-pretty">
                  {unlocked
                    ? 'Wszystkie pozycje są teraz widoczne. Skontaktuj się z nami, by omówić szczegóły konkretnego egzemplarza.'
                    : 'Podaj kod dostępu otrzymany od naszego specjalisty lub zarejestruj się, aby go uzyskać.'}
                </p>

                {!unlocked && (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                      <label htmlFor="access-code" className="sr-only">
                        Kod dostępu
                      </label>
                      <input
                        id="access-code"
                        type="text"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value)
                          if (error) setError(false)
                        }}
                        placeholder="Kod dostępu"
                        className="block w-full border border-white/20 bg-transparent px-4 py-3 font-sans text-sm uppercase tracking-[0.3em] text-white placeholder:text-white/30 focus:border-accent-gold focus:outline-none focus:ring-0"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={cn('btn-premium-white w-full', submitting && 'cursor-wait opacity-70')}
                      style={{ display: 'block' }}
                    >
                      {submitting ? 'Sprawdzanie...' : 'Odblokuj'}
                    </button>

                    {error && (
                      <p className="text-[11px] font-sans text-red-300">
                        Nieprawidłowy kod. Zarejestruj się, aby go otrzymać.
                      </p>
                    )}

                    <a
                      href="#registration"
                      onClick={scrollToForm}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold hover:text-accent-gold/80 transition-colors"
                    >
                      Nie mam kodu — zarejestruj się →
                    </a>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </Section>
  )
}
