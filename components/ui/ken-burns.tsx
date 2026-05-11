'use client'

import { type RefObject, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface KenBurnsProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  drift?: boolean
  targetRef?: RefObject<HTMLElement | null>
  offset?: [string, string]
}

export function KenBurns({
  children,
  className,
  intensity = 1.15,
  drift = false,
  targetRef,
  offset,
}: KenBurnsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: targetRef ?? ref,
    offset: (offset ?? ['start end', 'end start']) as never,
  })

  const rawScale = useTransform(scrollYProgress, [0, 1], [1, intensity])
  const rawY = useTransform(scrollYProgress, [0, 1], drift ? [-24, 24] : [0, 0])
  const springConfig = { stiffness: 80, damping: 22, mass: 0.6, restDelta: 0.001 }
  const scale = useSpring(rawScale, springConfig)
  const y = useSpring(rawY, springConfig)

  if (reduce) {
    return <div className={cn('overflow-hidden', className)}>{children}</div>
  }

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div
        style={{ scale, y }}
        className="relative h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}
