import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        'flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus-ring focus:border-primary/40',
        className
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx(
        'flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary transition-colors focus-ring focus:border-primary/40',
        className
      )}
      {...props}
    />
  )
)

Select.displayName = 'Select'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(
        'flex min-h-[100px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus-ring focus:border-primary/40',
        className
      )}
      {...props}
    />
  )
)

Textarea.displayName = 'Textarea'

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const FormGroup: React.FC<FormGroupProps> = ({ className, children, ...props }) => (
  <div className={clsx('flex flex-col gap-2', className)} {...props}>
    {children}
  </div>
)

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx('text-sm font-medium text-text-primary', className)}
      {...props}
    />
  )
)

Label.displayName = 'Label'
