import { useInView } from '../hooks/useInView'

/** Fades and lifts its children into view the first time they are scrolled to. */
export default function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -60px 0px', once: true })

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
