import { useEffect, useRef, useState } from 'react'

/**
 * Tells you whether the returned ref is on screen.
 * Pass `once: true` to stop watching after the first sighting.
 * Treats "no IntersectionObserver" as visible, so nothing stays hidden.
 */
export function useInView({ threshold = 0.15, rootMargin, once = false } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
