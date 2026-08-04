import { useState } from 'react'

export default function GalleryCard({ item }) {
  const [index, setIndex] = useState(0)
  const hasMultiple = item.images.length > 1

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
          src={item.images[index]}
          alt={item.caption}
          className="w-full h-56 object-cover"
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm text-white text-lg flex items-center justify-center hover:bg-white/60 transition-colors"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm text-white text-lg flex items-center justify-center hover:bg-white/60 transition-colors"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {item.images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-white/90' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <p className="text-sm font-medium text-maroon bg-white p-2 text-center">{item.caption}</p>
    </div>
  )
}
