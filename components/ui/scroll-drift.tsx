'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScrollDriftProps {
  children: React.ReactNode
  className?: string
  start?: number
  end?: number
  targetRef?: RefObject<HTMLElement | null>
}

export function ScrollDrift({
  children,
  className,
  start = -72,
  end = 72,
  targetRef,
}: ScrollDriftProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  const { scrollYProgress } = useScroll({
    target: targetRef ?? ref,
    offset: ['start 85%', 'end 15%'],
  })
  const rawY = useTransform(scrollYProgress, [0, 1], [start, end])
  const y = useSpring(rawY, { stiffness: 90, damping: 24, mass: 0.5, restDelta: 0.1 })

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const update = () => setEnabled(media.matches)

    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  if (reduce || !enabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  )
}
