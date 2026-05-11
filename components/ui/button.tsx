import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

const buttonVariants = {
  variant: {
    primary:
      'btn-primary bg-foreground text-background border border-transparent hover:bg-accent-gold hover:text-foreground focus-visible:ring-accent-gold',
    secondary:
      'bg-foreground text-background border border-foreground hover:bg-transparent hover:text-foreground focus-visible:ring-foreground',
    outline:
      'border border-border bg-transparent text-foreground hover:border-accent-gold hover:text-accent-gold focus-visible:ring-accent-gold',
    ghost:
      'bg-transparent text-foreground hover:text-accent-gold focus-visible:ring-accent-gold',
  },
  size: {
    sm: 'h-9 px-4 text-[10px]',
    md: 'h-11 px-6 text-[11px]',
    lg: 'h-12 px-8 text-xs',
  },
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant
  size?: keyof typeof buttonVariants.size
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-serif uppercase tracking-[0.15em] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
