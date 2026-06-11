import React, { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.2,
  className,
  suffix = '',
}) => {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [text, setText] = useState('0')
  const started = useRef(false)

  useEffect(() => {
    if (!started.current) {
      started.current = true
      spring.set(value)
    } else {
      spring.set(value)
    }
    const unsub = display.on('change', (v) => setText(String(v)))
    return unsub
  }, [value, spring, display])

  return (
    <motion.span className={className}>
      {text}
      {suffix}
    </motion.span>
  )
}
