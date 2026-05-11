'use client'

import type { JSX } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
 * Staggered reveal — pojawianie się tekstu word-by-word lub line-by-line
 * przy wjeździe w viewport. Stosować oszczędnie na kluczowych H2.
 */
export function RevealText({ text, className, as = 'h2', delay = 0, by = 'word' }: RevealTextProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  if (reduce) {
    const Static = as as keyof JSX.IntrinsicElements
    return <Static className={className}>{text}</Static>
  }

  const parts = by === 'word' ? text.split(' ') : text.split('\n')
  const sep = by === 'word' ? ' ' : '\n'

  return (
    <Tag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.06, delayChildren: delay },
        },
      }}
    >
      {parts.map((part, i) => (
        <motion.span
          key={i}
          className={cn(by === 'line' ? 'block' : 'inline-block', 'overflow-hidden')}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0 } },
          }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '100%', opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } },
            }}
          >
            {part}
            {i < parts.length - 1 && by === 'word' ? sep : ''}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  )
}
