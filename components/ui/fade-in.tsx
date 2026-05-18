import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

/**
 * CSS-only fade-in. Statyczny HTML pokazuje treść bez czekania na JS —
 * crawler i użytkownik bez JS widzą content od razu. Animacja jest tylko
 * warstwą wzbogacającą, respektuje `prefers-reduced-motion`.
 */
export function FadeIn({ children, className, delay = 0, direction = 'up' }: FadeInProps) {
  const dataDir = direction === 'down' ? 'down' : direction === 'none' ? 'none' : 'up'
  const style = delay ? { animationDelay: `${delay}s` } : undefined
  return (
    <div
      className={cn('wc-fade-in', className)}
      data-direction={dataDir}
      style={style}
    >
      {children}
    </div>
  )
}
