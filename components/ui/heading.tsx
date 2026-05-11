import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
  size?: 'xl' | 'lg' | 'md' | 'sm'
}

const sizeClasses = {
  xl: 'text-4xl lg:text-5xl xl:text-6xl',
  lg: 'text-3xl lg:text-4xl',
  md: 'text-2xl lg:text-3xl',
  sm: 'text-xl lg:text-2xl',
}

export function Heading({
  as: Component = 'h2',
  size = 'lg',
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        'font-serif font-semibold tracking-tight text-foreground text-balance',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
