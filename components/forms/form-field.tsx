import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FormFieldBaseProps {
  label: string
  error?: string
  hint?: string
}

interface InputFieldProps
  extends FormFieldBaseProps,
    InputHTMLAttributes<HTMLInputElement> {
  as?: 'input'
}

interface TextareaFieldProps
  extends FormFieldBaseProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea'
}

type FormFieldProps = InputFieldProps | TextareaFieldProps

export function FormField(props: FormFieldProps) {
  const { label, error, hint, className, as = 'input', ...rest } = props

  const inputClasses = cn(
    'w-full rounded border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors',
    'focus:border-accent-gold focus:outline-none focus:ring-1 focus:ring-accent-gold',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    className
  )

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          className={cn(inputClasses, 'min-h-[120px] resize-y')}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={inputClasses}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
