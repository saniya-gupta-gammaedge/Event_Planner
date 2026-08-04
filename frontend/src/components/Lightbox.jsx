import { useCallback, useEffect, useRef, useState } from 'react'

const SWIPE_PX = 50

/** Full-screen photo viewer. Arrow keys, swipe and Esc all work. */
export default function Lightbox({ images, caption, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const closeRef = useRef(null)
  const touchStartX = useRef(null)

  const step = useCallback(
    (delta) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length]
  )

  // Take focus once, and stop the page behind from scrolling.
  useEffect(() => {
    closeRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, step])

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return

    const travelled = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(travelled) > SWIPE_PX) step(travelled < 0 ? 1 : -1)

    touchStartX.current = null
  }

  const hasMultiple = images.length > 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex flex-col bg-black/90"
    >
      <div className="flex items-center justify-between px-4 py-3 text-white/80">
        <span className="text-sm">
          {hasMultiple ? `${index + 1} / ${images.length}` : caption}
        </span>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="rounded-full px-3 py-1 text-2xl hover:bg-white/10"
        >
          ✕
        </button>
      </div>

      {/* min-h-0 lets this shrink inside the flex column, so a tall photo
          scales down to fit instead of overflowing off screen. */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative flex flex-1 min-h-0 items-center justify-center overflow-auto px-4 pb-4"
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            aria-label="Previous photo"
            className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/30"
          >
            ‹
          </button>
        )}

        <img
          src={images[index]}
          alt={caption}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-lg object-contain"
        />

        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            aria-label="Next photo"
            className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/30"
          >
            ›
          </button>
        )}
      </div>

      <p className="px-4 pb-6 text-center text-sm text-white/80">{caption}</p>
    </div>
  )
}
