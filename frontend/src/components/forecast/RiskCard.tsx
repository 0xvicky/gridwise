import { motion } from 'framer-motion'
import { Minus, TrendingUp } from 'lucide-react'
import clsx from 'clsx'
import { Card } from '@/components/Card'

interface RiskCardProps {
  label: string
  value: number
  trend?: number
  index: number
}

const getRiskStyles = (value: number) => {
  if (value <= 40) {
    return {
      text: 'text-success',
      bar: 'bg-success',
      indicator: 'bg-success/10 text-success',
    }
  }

  if (value <= 70) {
    return {
      text: 'text-warning',
      bar: 'bg-warning',
      indicator: 'bg-warning/10 text-warning',
    }
  }

  return {
    text: 'text-critical',
    bar: 'bg-critical',
    indicator: 'bg-critical/10 text-critical',
  }
}

export const RiskCard = ({ label, value, trend, index }: RiskCardProps) => {
  const styles = getRiskStyles(value)
  const boundedValue = Math.min(Math.max(value, 0), 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-secondary">{label}</p>
            <p className={clsx('mt-3 text-4xl font-semibold tracking-tight', styles.text)}>
              {Math.round(value)}%
            </p>
          </div>
          <div
            className={clsx(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
              styles.indicator
            )}
          >
            {trend === undefined ? <Minus size={12} /> : <TrendingUp size={12} />}
            {trend === undefined ? 'Baseline' : `+${Math.round(trend)}%`}
          </div>
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-surface">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${boundedValue}%` }}
            transition={{ delay: 0.15 + index * 0.06, duration: 0.6, ease: 'easeOut' }}
            className={clsx('h-full rounded-full', styles.bar)}
          />
        </div>
      </Card>
    </motion.div>
  )
}
