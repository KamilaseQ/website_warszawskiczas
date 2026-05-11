import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'premium'
}

const variantClasses = {
  default: 'bg-muted text-muted-foreground',
  outline: 'border border-border text-muted-foreground',
  premium: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20',
}

export function Badge({
  variant = 'default',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
