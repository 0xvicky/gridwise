import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  label?: string
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled,
  id,
  label,
}) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={clsx(
      'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-200 focus-ring disabled:cursor-not-allowed disabled:opacity-50',
      checked
        ? 'border-accent bg-accent'
        : 'border-primary/30 bg-primary-light'
    )}
  >
    <motion.span
      animate={{ x: checked ? 20 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm"
    />
  </button>
)
