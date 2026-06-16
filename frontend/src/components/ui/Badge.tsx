import React from 'react'
import clsx from 'clsx'

type BadgeVariant = 'default' | 'success' | 'warning' | 'critical' | 'neutral'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-light text-primary-dark border-primary/15',
  success: 'bg-green-50 text-success border-green-100',
  warning: 'bg-accent-light text-accent-dark border-orange-100',
  critical: 'bg-red-50 text-critical border-red-100',
  neutral: 'bg-background text-text-secondary border-border',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold tracking-wide',
      variantStyles[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
)
