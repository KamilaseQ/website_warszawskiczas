'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import type { Product } from '@/data/mock-products'
import { localeFromPathname, ui } from '@/lib/i18n'

interface ProductCatalogProps {
  products: Product[]
}

const CATEGORIES = [
  { value: 'zegarki', label: 'Zegarki' },
  { value: 'bizuteria', label: 'Biżuteria' },
] as const

const STATUSES = ['Wszystkie', 'Dostępny', 'Zarezerwowany', 'Niedostępny'] as const

const SORTS = [
  { value: 'featured', label: 'Polecane' },
  { value: 'price-asc', label: 'Cena rosnąco' },
  { value: 'price-desc', label: 'Cena malejąco' },
  { value: 'brand-asc', label: 'Marka A–Z' },
] as const

const PRICE_MIN = 0
const PRICE_MAX = 500000

// Marki preferowane w sortowaniu "Polecane" — kolejność ma znaczenie
const FEATURED_BRAND_ORDER = ['Rolex', 'Cartier', 'Patek Philippe', 'Audemars Piguet', 'Breitling']
const featuredBrandRank = (brand: string) => {
  const idx = FEATURED_BRAND_ORDER.findIndex((b) => b.toLowerCase() === brand.toLowerCase())
  return idx === -1 ? FEATURED_BRAND_ORDER.length : idx
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)
  const t = ui[locale]
  const reducedMotion = useReducedMotion()
  const [category, setCategory] = useState<'zegarki' | 'bizuteria'>('zegarki')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [status, setStatus] = useState<string>('Wszystkie')
  const [sort, setSort] = useState<string>('featured')
  const [priceMin, setPriceMin] = useState<number>(PRICE_MIN)
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX)
  const [onlyOnRequest, setOnlyOnRequest] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const categoryLabels: Record<string, string> = { zegarki: t.products, bizuteria: t.jewelry }
  const statusLabels: Record<string, string> = {
    Wszystkie: t.all,
    Dostępny: t.available,
    Zarezerwowany: t.reserved,
    Niedostępny: t.unavailable,
  }
  const sortLabels: Record<string, string> = {
    featured: t.featured,
    'price-asc': t.priceAsc,
    'price-desc': t.priceDesc,
    'brand-asc': t.brandAsc,
  }

  // Marki z aktualnych danych — skaluje się automatycznie wraz z rozbudową katalogu
  const brandsForCategory = useMemo(() => {
    const set = new Set<string>()
    products.filter((p) => p.category === category).forEach((p) => set.add(p.brand))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pl'))
  }, [products, category])

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))
  }

  const filtered = useMemo(() => {
    let out = products.filter((p) => p.category === category)
    if (selectedBrands.length > 0) out = out.filter((p) => selectedBrands.includes(p.brand))
    if (status !== 'Wszystkie') out = out.filter((p) => p.status === status)
    if (onlyOnRequest) out = out.filter((p) => p.priceOnRequest)
    out = out.filter((p) => {
      if (!p.price) return true
      return p.price >= priceMin && p.price <= priceMax
    })

    if (sort === 'price-asc') {
      out = [...out].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    } else if (sort === 'price-desc') {
      out = [...out].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    } else if (sort === 'brand-asc') {
      out = [...out].sort((a, b) => a.brand.localeCompare(b.brand, 'pl'))
    } else if (sort === 'featured') {
      // Top 4 marki przeplecione round-robin (Rolex / Cartier / Patek / AP),
      // potem Breitling, potem reszta alfabetycznie. Stabilne — nie miesza się
      // przy każdym renderze.
      const TOP_N = 4
      const buckets: Product[][] = FEATURED_BRAND_ORDER.slice(0, TOP_N).map((brand) =>
        out.filter((p) => p.brand.toLowerCase() === brand.toLowerCase()),
      )
      const rest = out
        .filter((p) => featuredBrandRank(p.brand) >= TOP_N)
        .sort((a, b) => {
          const ra = featuredBrandRank(a.brand)
          const rb = featuredBrandRank(b.brand)
          if (ra !== rb) return ra - rb
          return a.brand.localeCompare(b.brand, 'pl')
        })

      const interleaved: Product[] = []
      let i = 0
      while (buckets.some((b) => i < b.length)) {
        for (const b of buckets) {
          if (i < b.length) interleaved.push(b[i]!)
        }
        i++
      }
      out = [...interleaved, ...rest]
    }

    return out
  }, [products, category, selectedBrands, status, sort, priceMin, priceMax, onlyOnRequest])

  const activeFilterCount =
    (selectedBrands.length > 0 ? 1 : 0) +
    (status !== 'Wszystkie' ? 1 : 0) +
    (priceMin !== PRICE_MIN || priceMax !== PRICE_MAX ? 1 : 0) +
    (onlyOnRequest ? 1 : 0)

  const clearFilters = () => {
    setSelectedBrands([])
    setStatus('Wszystkie')
    setPriceMin(PRICE_MIN)
    setPriceMax(PRICE_MAX)
    setOnlyOnRequest(false)
  }

  const fmt = (v: number) =>
    new Intl.NumberFormat(locale === 'ua' ? 'uk-UA' : locale === 'en' ? 'en-US' : 'pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(v)

  useBodyScrollLock(drawerOpen)

  // Esc zamyka drawer
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4 lg:mb-8">
        {/* Tabs kategorii */}
        <div className="flex gap-6 sm:gap-8">
          {CATEGORIES.map((c) => {
            const isActive = c.value === category
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setCategory(c.value as 'zegarki' | 'bizuteria')
                  setSelectedBrands([])
                }}
                className={cn(
                  'relative pb-3 font-serif text-xs uppercase tracking-[0.3em] transition-colors duration-300 sm:text-sm',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {categoryLabels[c.value]}
                <span
                  className={cn(
                    'absolute -bottom-px left-0 right-0 h-px transition-all duration-500',
                    isActive ? 'bg-accent-gold' : 'bg-transparent'
                  )}
                />
              </button>
            )
          })}
        </div>

        {/* Akcje */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={t.filters}
            aria-expanded={drawerOpen}
            aria-controls="catalog-filters"
            className="group inline-flex items-center gap-2 border border-foreground/15 bg-transparent px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:border-accent-gold hover:text-accent-gold sm:px-4"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t.filters}</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center bg-accent-gold px-1 font-sans text-[9px] font-bold tracking-normal text-[#0a0a0a]">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label={t.sort}
              className="appearance-none border border-foreground/15 bg-transparent py-2 pl-3 pr-8 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-foreground transition-colors duration-300 hover:border-accent-gold focus:outline-none focus:ring-0 sm:pl-4 sm:pr-9"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-background">
                  {sortLabels[s.value]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/60 sm:right-3" />
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence initial={false}>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground/70">
                {t.active}
              </span>
              {selectedBrands.map((b) => (
                <FilterChip key={b} label={b} onClear={() => toggleBrand(b)} />
              ))}
              {status !== 'Wszystkie' && (
                <FilterChip label={statusLabels[status] ?? status} onClear={() => setStatus('Wszystkie')} />
              )}
              {(priceMin !== PRICE_MIN || priceMax !== PRICE_MAX) && (
                <FilterChip
                  label={`${fmt(priceMin)} – ${fmt(priceMax)}`}
                  onClear={() => {
                    setPriceMin(PRICE_MIN)
                    setPriceMax(PRICE_MAX)
                  }}
                />
              )}
              {onlyOnRequest && (
                <FilterChip label={t.priceOnRequest} onClear={() => setOnlyOnRequest(false)} />
              )}
              <button
                type="button"
                onClick={clearFilters}
                className="ml-1 font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-accent-gold"
              >
                {t.clearAll}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? t.itemSingular : filtered.length < 5 ? t.itemFew : t.itemMany}
      </p>

      {filtered.length > 0 ? (
        <motion.div
          key={`${category}-${selectedBrands.join(',')}-${status}-${priceMin}-${priceMax}-${onlyOnRequest}-${sort}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.07, delayChildren: 0.05 } },
          }}
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-y-16 xl:grid-cols-4"
        >
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
                },
              }}
            >
              <ProductCard product={p} aspect="portrait" />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="border border-dashed border-border py-24 text-center">
          <p className="font-serif italic text-lg text-muted-foreground">
            {category === 'bizuteria'
              ? locale === 'pl'
                ? 'Kolekcja biżuterii pojawi się wkrótce.'
                : locale === 'en'
                  ? 'The jewellery collection will appear soon.'
                  : 'Колекція ювелірних виробів з’явиться незабаром.'
              : t.noMatchingItems}
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold"
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      )}

      {/* DRAWER FILTRÓW */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[300] bg-[#0a0a0a]/40 backdrop-blur-[2px]"
              aria-hidden="true"
            />
            <motion.aside
              id="catalog-filters"
              role="dialog"
              aria-modal="true"
              aria-label={t.filters}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 right-0 z-[301] flex w-full max-w-md flex-col bg-background shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.25)]"
            >
              <header className="flex items-center justify-between border-b border-border px-6 py-5 lg:px-8">
                <div>
                  <p className="font-sans text-[9px] font-bold uppercase tracking-[0.4em] text-accent-gold">
                    {locale === 'pl' ? 'Selekcja' : locale === 'en' ? 'Selection' : 'Добірка'}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-medium tracking-tight text-foreground">
                    {t.filters}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t.closeFilters}
                  className="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-accent-gold"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
                <div className="space-y-8">
                  {/* Marka — checkboxy, multi-select */}
                  <FilterSection label={`${t.brand} · ${brandsForCategory.length}`}>
                    <ul className="space-y-1.5">
                      {brandsForCategory.map((b) => {
                        const isActive = selectedBrands.includes(b)
                        const id = `brand-${b.replace(/\s+/g, '-').toLowerCase()}`
                        return (
                          <li key={b}>
                            <label
                              htmlFor={id}
                              className="flex cursor-pointer items-center gap-3 py-1.5 font-sans text-[12px] uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent-gold"
                            >
                              <span
                                className={cn(
                                  'relative flex h-4 w-4 flex-shrink-0 items-center justify-center border transition-colors duration-200',
                                  isActive
                                    ? 'border-accent-gold bg-accent-gold'
                                    : 'border-foreground/30 bg-transparent'
                                )}
                              >
                                {isActive && (
                                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-[#0a0a0a]" aria-hidden>
                                    <path d="M2.5 6.5L5 9L9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </span>
                              <input
                                id={id}
                                type="checkbox"
                                checked={isActive}
                                onChange={() => toggleBrand(b)}
                                className="sr-only"
                              />
                              <span>{b}</span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </FilterSection>

                  {/* Status / dostępność */}
                  <FilterSection label={t.availability}>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => {
                        const isActive = s === status
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={cn(
                              'border px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300',
                              isActive
                                ? 'border-accent-gold bg-accent-gold text-[#0a0a0a]'
                                : 'border-foreground/15 text-foreground hover:border-accent-gold hover:text-accent-gold'
                            )}
                          >
                            {statusLabels[s] ?? s}
                          </button>
                        )
                      })}
                    </div>
                  </FilterSection>

                  {/* Cena — widełki min/max */}
                  <FilterSection label={`${t.price} · ${fmt(priceMin)} – ${fmt(priceMax)}`}>
                    <div className="dual-range relative h-6">
                      <span aria-hidden className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-foreground/20" />
                      <span
                        aria-hidden
                        className="absolute top-1/2 h-px -translate-y-1/2 bg-accent-gold"
                        style={{
                          left: `${(priceMin / PRICE_MAX) * 100}%`,
                          right: `${100 - (priceMax / PRICE_MAX) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={1000}
                        value={priceMin}
                        onChange={(e) => {
                          const v = Math.min(Number(e.target.value), priceMax - 1000)
                          setPriceMin(Math.max(PRICE_MIN, v))
                        }}
                        aria-label={t.priceMin}
                        className="dual-range-input"
                      />
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={1000}
                        value={priceMax}
                        onChange={(e) => {
                          const v = Math.max(Number(e.target.value), priceMin + 1000)
                          setPriceMax(Math.min(PRICE_MAX, v))
                        }}
                        aria-label={t.priceMax}
                        className="dual-range-input"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80">
                      <span>od&nbsp;<strong className="font-bold text-foreground">{fmt(priceMin)}</strong></span>
                      <span>do&nbsp;<strong className="font-bold text-foreground">{fmt(priceMax)}{priceMax === PRICE_MAX ? '+' : ''}</strong></span>
                    </div>
                    <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                      {t.onRequestNotFiltered}
                    </p>
                  </FilterSection>

                  {/* Toggle: tylko cena na zapytanie */}
                  <FilterSection label={t.featuredFilter}>
                    <label className="flex cursor-pointer items-center gap-3 select-none">
                      <input
                        type="checkbox"
                        checked={onlyOnRequest}
                        onChange={(e) => setOnlyOnRequest(e.target.checked)}
                        className="sr-only peer"
                      />
                      <span
                        className={cn(
                          'relative h-5 w-9 border transition-colors duration-300',
                          onlyOnRequest
                            ? 'border-accent-gold bg-accent-gold/20'
                            : 'border-foreground/25 bg-transparent'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-1/2 h-3 w-3 -translate-y-1/2 transition-all duration-300',
                            onlyOnRequest
                              ? 'left-[calc(100%-0.875rem)] bg-accent-gold'
                              : 'left-1 bg-foreground/40'
                          )}
                        />
                      </span>
                      <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-foreground">
                        {locale === 'pl' ? 'Tylko cena na zapytanie' : locale === 'en' ? 'Only price on request' : 'Тільки ціна за запитом'}
                      </span>
                    </label>
                  </FilterSection>
                </div>
              </div>

              <footer className="flex items-center gap-3 border-t border-border px-6 py-5 lg:px-8">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={activeFilterCount === 0}
                  className="flex-1 border border-foreground/15 px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-foreground/15 disabled:hover:text-foreground"
                >
                  {t.clear}
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="btn-sharp flex-[2] text-center"
                >
                  {locale === 'pl' ? 'Pokaż' : locale === 'en' ? 'Show' : 'Показати'} {filtered.length}
                </button>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .dual-range-input {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
          margin: 0;
        }
        .dual-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c9a962;
          border: 2px solid #0a0a0a;
          cursor: pointer;
          pointer-events: auto;
          transition: transform 0.2s ease;
        }
        .dual-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.12);
        }
        .dual-range-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c9a962;
          border: 2px solid #0a0a0a;
          cursor: pointer;
          pointer-events: auto;
        }
        .dual-range-input::-webkit-slider-runnable-track {
          background: transparent;
        }
        .dual-range-input::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/80">
        {label}
      </p>
      {children}
    </div>
  )
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-foreground/15 bg-background px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Usuń filtr ${label}`}
        className="text-muted-foreground transition-colors hover:text-accent-gold"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
