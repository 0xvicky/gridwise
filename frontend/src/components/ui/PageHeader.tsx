import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  back?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  back,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className={clsx(
      'flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center',
      className
    )}
  >
    <div>
      {back}
      <h1 className="text-page-title text-primary">{title}</h1>
      {description && (
        <p className="mt-2 text-base font-medium text-accent-dark">{description}</p>
      )}
    </div>
    {action}
  </motion.div>
)
