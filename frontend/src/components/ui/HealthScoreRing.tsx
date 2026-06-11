import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface HealthScoreRingProps {
  score: number
  size?: number
  className?: string
}

export const HealthScoreRing: React.FC<HealthScoreRingProps> = ({
  score,
  size = 120,
  className,
}) => {
  const stroke = 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 80 ? '#0F9D58' : score >= 60 ? '#F59E0B' : '#DC2626'

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5ECE8"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-text-primary">{score}</span>
        <span className="text-xs text-text-secondary">Health</span>
      </div>
    </div>
  )
}
