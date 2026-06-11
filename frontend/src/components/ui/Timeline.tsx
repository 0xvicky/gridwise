import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export interface TimelineEvent {
  id: string
  title: string
  description: string
  time: string
  type?: 'info' | 'success' | 'warning' | 'critical'
}

interface TimelineProps {
  events: TimelineEvent[]
  className?: string
}

const dotColors = {
  info: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
}

export const Timeline: React.FC<TimelineProps> = ({ events, className }) => (
  <div className={clsx('space-y-0', className)}>
    {events.map((event, idx) => (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex gap-4 pb-8 last:pb-0"
      >
        {idx < events.length - 1 && (
          <div className="absolute left-[5px] top-3 h-full w-px bg-border" />
        )}
        <div
          className={clsx(
            'relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-background',
            dotColors[event.type ?? 'info']
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium text-text-primary">{event.title}</p>
            <span className="shrink-0 text-xs text-text-secondary">{event.time}</span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{event.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
)
