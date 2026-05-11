'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: FaqItem[]
  variant?: 'light' | 'dark'
  defaultOpen?: number | null
  numbering?: 'none' | 'roman'
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export function FaqAccordion({
  items,
  variant = 'light',
  defaultOpen = null,
  numbering = 'none',
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)
  const isDark = variant === 'dark'

  return (
    <div className={cn('divide-y', isDark ? 'divide-white/10' : 'divide-border')}>
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div key={i} className="py-2">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className={cn(
                'group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-300',
                isDark ? 'text-white hover:text-accent-gold' : 'text-foreground hover:text-accent-gold'
              )}
            >
              <span className="flex items-baseline gap-4 sm:gap-6">
                {numbering === 'roman' && (
                  <span
                    aria-hidden
                    className="hidden flex-shrink-0 font-serif italic font-normal text-accent-gold/60 sm:inline-block sm:text-base"
                    style={{ minWidth: '2ch', letterSpacing: '0.05em' }}
                  >
                    {ROMAN[i] ?? i + 1}
                  </span>
                )}
                <span className="font-serif text-lg font-medium leading-snug sm:text-xl">
                  {item.q}
                </span>
              </span>
              <span
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 items-center justify-center border transition-all duration-500',
                  isDark
                    ? open
                      ? 'border-accent-gold bg-accent-gold/10 text-accent-gold rotate-45'
                      : 'border-white/30 text-white/60 group-hover:border-accent-gold group-hover:text-accent-gold'
                    : open
                      ? 'border-accent-gold bg-accent-gold/10 text-accent-gold rotate-45'
                      : 'border-border text-foreground/60 group-hover:border-accent-gold group-hover:text-accent-gold'
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={cn(
                'grid overflow-hidden transition-all duration-500 ease-out',
                open ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="min-h-0">
                <p
                  className={cn(
                    'pr-14 text-sm leading-relaxed text-pretty',
                    isDark ? 'text-white/60' : 'text-muted-foreground'
                  )}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
