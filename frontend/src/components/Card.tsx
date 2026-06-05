import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div
    className={clsx(
      'rounded-lg border border-dark-600 border-opacity-50 bg-dark-700 bg-opacity-40 backdrop-blur-sm p-6 shadow-lg shadow-black/50 hover:border-accent-cyan hover:border-opacity-50 transition-all duration-300',
      'bg-gradient-to-br from-dark-700 from-opacity-30 to-dark-800 to-opacity-20',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={clsx('mb-4 border-b border-dark-600 border-opacity-50 pb-4', className)} {...props}>
    {children}
  </div>
)

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={clsx('text-lg font-semibold text-white', className)} {...props}>
    {children}
  </h3>
)

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  children,
  ...props
}) => (
  <p className={clsx('text-sm text-white', className)} {...props}>
    {children}
  </p>
)

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={className} {...props}>
    {children}
  </div>
)
