import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'

/**
 * Counts from 0 up to `end` once scrolled into view.
 * Reduced-motion users get the final number straight away.
 */
export default function CountUp({ end, duration = 1800, suffix = '' }) {
  const [ref, inView] = useInView({ threshold: 0.4, once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(end)
      return
    }

    let frame
    let startedAt

    const step = (timestamp) => {
      if (startedAt === undefined) startedAt = timestamp

      const progress = Math.min(1, (timestamp - startedAt) / duration)
      setValue(end * (1 - Math.pow(1 - progress, 3)))

      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, end, duration])

  return (
    <span ref={ref}>
      {Math.round(value)}
      {suffix}
    </span>
  )
}
