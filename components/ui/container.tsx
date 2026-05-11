import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide'
}

export function Container({
  className,
  size = 'default',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 lg:px-8',
        {
          'max-w-7xl': size === 'default',
          'max-w-4xl': size === 'narrow',
          'max-w-screen-2xl': size === 'wide',
        },
        className
      )}
      {...props}
    />
  )
}
