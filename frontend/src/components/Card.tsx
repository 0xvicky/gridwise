import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

const cardClassName =
  'rounded-card border border-border bg-surface p-6 shadow-card transition-all duration-300 ease-premium'

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hover = false,
  ...props
}) => {
  const motionProps = props as React.ComponentProps<typeof motion.div>

  if (hover) {
    return (
      <motion.div
        whileHover={{
          y: -2,
          boxShadow: '0 18px 45px rgba(31, 41, 55, 0.08), 0 4px 10px rgba(21, 89, 89, 0.06)',
          transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
        }}
        className={clsx(cardClassName, 'cursor-default', className)}
        {...motionProps}
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
    className={clsx('mb-6 flex items-center justify-between gap-4 border-b border-border pb-5', className)}
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
    className={clsx('text-section-title text-primary', className)}
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
  <p className={clsx('text-sm font-medium text-accent-dark', className)} {...props}>
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
