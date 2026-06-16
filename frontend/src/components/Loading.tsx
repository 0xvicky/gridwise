import React from 'react'
import { AlertCircle } from 'lucide-react'
import { InfrastructureLoader } from './three/InfrastructureLoader'
import { Button } from './Button'

export const LoadingSpinner: React.FC = () => <InfrastructureLoader />

export const Skeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="mb-3 h-4 animate-pulse rounded-lg bg-border/60"
      />
    ))}
  </>
)

interface ErrorProps {
  message?: string
  onRetry?: () => void
}

export const Error: React.FC<ErrorProps> = ({
  message = 'Something went wrong',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center rounded-card border border-red-100 bg-red-50/50 px-6 py-14">
    <AlertCircle className="mb-3 h-8 w-8 text-critical" />
    <p className="mb-4 text-sm text-critical">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
)

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-background/70 px-6 py-16">
    {icon && <div className="mb-4 text-text-secondary">{icon}</div>}
    <h3 className="mb-2 text-base font-semibold text-primary">{title}</h3>
    {description && (
      <p className="mb-6 max-w-sm text-center text-sm text-text-secondary">{description}</p>
    )}
    {action}
  </div>
)

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-100 text-success',
    error: 'bg-red-50 border-red-100 text-critical',
    warning: 'bg-accent-light border-orange-100 text-accent-dark',
    info: 'bg-primary-light border-primary/15 text-primary-dark',
  }[type]

  return (
    <div className={`rounded-card border p-4 ${styles}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 text-sm font-medium opacity-60 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
