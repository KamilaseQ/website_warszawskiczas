import type { JSX } from 'react'
import { cn } from '@/lib/utils'

interface RevealTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  /** word | line — sposób podziału tekstu */
  by?: 'word' | 'line'
}

/**
 * CSS-only staggered reveal. Statyczny HTML zawiera pełny tekst widoczny
 * od razu — animacja to tylko stagger na opacity/blur per słowo/linia.
 * Respektuje `prefers-reduced-motion` przez globalny media query.
 */
export function RevealText({ text, className, as = 'h2', delay = 0, by = 'word' }: RevealTextProps) {
  const Tag = as as keyof JSX.IntrinsicElements
  const parts = by === 'word' ? text.split(' ') : text.split('\n')

  return (
    <Tag className={cn(className)}>
      {parts.map((part, i) => (
        <span
          key={i}
          className={cn(by === 'line' ? 'block' : 'inline-block', 'wc-fade-in')}
          style={{ animationDelay: `${delay + i * 0.06}s` }}
        >
          {part}
          {i < parts.length - 1 && by === 'word' ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
