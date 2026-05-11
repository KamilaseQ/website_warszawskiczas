import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'lead' | 'body' | 'small' | 'caption'
  muted?: boolean
}

const variantClasses = {
  lead: 'text-lg lg:text-xl leading-relaxed',
  body: 'text-base leading-relaxed',
  small: 'text-sm leading-relaxed',
  caption: 'text-xs leading-normal',
}

export function Text({
  variant = 'body',
  muted = false,
  className,
  ...props
}: TextProps) {
  return (
    <p
      className={cn(
        variantClasses[variant],
        muted ? 'text-muted-foreground' : 'text-foreground',
        className
      )}
      {...props}
    />
  )
}
