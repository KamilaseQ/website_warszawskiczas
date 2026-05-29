'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MagneticProps {
  children: ReactNode
  className?: string
  /** Maksymalne przesunięcie w pikselach */
  strength?: number
}

// Kept as a compatibility wrapper after removing the Framer Motion hover payload.
export function Magnetic({ children, className, strength = 12 }: MagneticProps) {
  void strength
  return <div className={cn('inline-block', className)}>{children}</div>
}
