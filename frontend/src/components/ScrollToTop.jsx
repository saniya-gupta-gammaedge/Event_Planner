import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Sends each new page to the top instead of keeping the previous scroll position. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
