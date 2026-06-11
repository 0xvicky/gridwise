export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
}

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
}

export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
}

export const tableRowFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
}
