import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'muted' | 'dark'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  id?: string
}

const spacingClasses = {
  sm: 'py-12 lg:py-16',
  md: 'py-16 lg:py-24',
  lg: 'py-20 lg:py-32',
  xl: 'py-24 lg:py-40',
}

const variantClasses = {
  default: 'bg-background',
  muted: 'bg-muted relative grain-overlay',
  dark: 'bg-foreground text-background',
}

export function Section({
  className,
  variant = 'default',
  spacing = 'md',
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacingClasses[spacing],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
