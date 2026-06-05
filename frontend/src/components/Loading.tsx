import React from 'react'
import { AlertCircle } from 'lucide-react'

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border-2 border-dark-600 animate-orbit" />
      <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-cyan border-r-accent-cyan animate-orbit" style={{animationDirection: 'reverse'}} />
      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue animate-pulse" />
    </div>
  </div>
)

export const Skeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="mb-3 h-4 animate-pulse rounded bg-dark-700 bg-opacity-50" />
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
  <div className="flex flex-col items-center justify-center rounded-lg border border-red-900 border-opacity-50 bg-dark-700 bg-opacity-50 py-12 backdrop-blur-sm">
    <AlertCircle className="mb-2 h-8 w-8 text-red-400" />
    <p className="mb-4 text-sm text-red-300">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
      >
        Try again
      </button>
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
  <div className="flex flex-col items-center justify-center rounded-lg border border-dark-600 border-opacity-50 bg-dark-700 bg-opacity-30 py-12 backdrop-blur-sm hover:border-accent-cyan transition-colors">
    {icon && <div className="mb-4 text-white group-hover:text-accent-cyan transition-colors">{icon}</div>}
    <h3 className="mb-2 text-base font-medium text-white">{title}</h3>
    {description && <p className="mb-4 text-sm text-white">{description}</p>}
    {action}
  </div>
)

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const bgColor = {
    success: 'bg-dark-700 bg-opacity-50 border-accent-green border-opacity-50',
    error: 'bg-dark-700 bg-opacity-50 border-red-900 border-opacity-50',
    warning: 'bg-dark-700 bg-opacity-50 border-amber-900 border-opacity-50',
    info: 'bg-dark-700 bg-opacity-50 border-accent-cyan border-opacity-50',
  }[type]

  const textColor = {
    success: 'text-accent-green',
    error: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-accent-cyan',
  }[type]

  return (
    <div className={`rounded-lg border p-4 backdrop-blur-sm ${bgColor}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${textColor}`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`text-sm font-medium ${textColor} hover:opacity-75 transition-opacity`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
