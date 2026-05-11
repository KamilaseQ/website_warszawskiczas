'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function FadeIn({ children, className, delay = 0, direction = 'up' }: FadeInProps) {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { y: 30 },
    right: { y: 30 },
    none: { x: 0, y: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', ...directions[direction] }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.9, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
