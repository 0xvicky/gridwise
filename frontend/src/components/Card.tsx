import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

const cardClassName =
  'rounded-card border border-border bg-background p-6 shadow-card transition-shadow duration-300'

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hover = false,
  ...props
}) => {
  if (hover) {
    return (
      <motion.div
        whileHover={{
          y: -2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)',
          transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
        }}
        className={clsx(cardClassName, 'cursor-default', className)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={clsx(cardClassName, className)} {...props}>
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={clsx('mb-5 flex items-center justify-between border-b border-border pb-4', className)}
    {...props}
  >
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
  <h3
    className={clsx('text-section-title text-text-primary', className)}
    {...props}
  >
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
  <p className={clsx('text-sm text-text-secondary', className)} {...props}>
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
