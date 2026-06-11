import React from 'react'
import clsx from 'clsx'

type BadgeVariant = 'default' | 'success' | 'warning' | 'critical' | 'neutral'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-light text-primary-dark border-primary/10',
  success: 'bg-primary-light text-primary-dark border-primary/10',
  warning: 'bg-amber-50 text-warning border-amber-100',
  critical: 'bg-red-50 text-critical border-red-100',
  neutral: 'bg-surface text-text-secondary border-border',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tracking-wide',
      variantStyles[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
)
