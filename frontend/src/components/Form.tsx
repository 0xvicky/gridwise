import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        'flex h-10 rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-50',
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
        'flex h-10 rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-white transition-all focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-50',
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
        'flex rounded-lg border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-white placeholder-gray-500 transition-all focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-opacity-50',
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
      className={clsx('text-sm font-medium text-white', className)}
      {...props}
    />
  )
)

Label.displayName = 'Label'
