import { useState } from 'react'
import { isPlaceholder } from '../data/gallery'
import Lightbox from './Lightbox'

export default function GalleryCard({ item }) {
  const [index, setIndex] = useState(0)
  const [lightboxStart, setLightboxStart] = useState(null)

  const hasMultiple = item.images.length > 1
  const current = item.images[index]

  // Photos are dark, the "coming soon" slot is cream — so the controls flip
  // colour to stay visible on whichever is showing.
  const onPlaceholder = isPlaceholder(current)

  const arrowClass = onPlaceholder
    ? 'bg-black/10 text-black hover:bg-black/20'
    : 'bg-white/40 text-white hover:bg-white/60'

  const dotClass = (isCurrent) => {
    if (onPlaceholder) return isCurrent ? 'bg-black' : 'bg-black/30'
    return isCurrent ? 'bg-white/90' : 'bg-white/40'
  }

  // The lightbox only ever shows real photos, never a "coming soon" slot.
  const realImages = item.images.filter((src) => !isPlaceholder(src))

  const prev = (e) => {
    e.stopPropagation()
    setIndex((i) => (i === 0 ? item.images.length - 1 : i - 1))
  }

  const next = (e) => {
    e.stopPropagation()
    setIndex((i) => (i === item.images.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gold/30">
      <div className="relative">
        <img
          src={current}
          alt={item.caption}
          loading="lazy"
          decoding="async"
          onClick={() => !onPlaceholder && setLightboxStart(realImages.indexOf(current))}
          className={`w-full h-56 object-cover ${onPlaceholder ? '' : 'cursor-zoom-in'}`}
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full backdrop-blur-sm text-lg flex items-center justify-center transition-colors ${arrowClass}`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full backdrop-blur-sm text-lg flex items-center justify-center transition-colors ${arrowClass}`}
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {item.images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${dotClass(i === index)}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-sm font-medium text-maroon bg-white p-2 text-center">{item.caption}</p>

      {lightboxStart !== null && (
        <Lightbox
          images={realImages}
          caption={item.caption}
          startIndex={lightboxStart}
          onClose={() => setLightboxStart(null)}
        />
      )}
    </div>
  )
}
