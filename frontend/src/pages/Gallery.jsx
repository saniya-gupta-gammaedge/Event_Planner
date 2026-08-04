import { useState } from 'react'
import { gallery } from '../data/gallery'
import GalleryCard from '../components/GalleryCard'

export default function Gallery() {
  const [activeId, setActiveId] = useState('all')

  const shown = activeId === 'all' ? gallery : gallery.filter((item) => item.id === activeId)

  const chipClass = (isActive) =>
    `shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-maroon text-white border-maroon'
        : 'bg-white text-neutral-700 border-neutral-200 hover:border-gold'
    }`

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-maroon mb-2">Our Work</h1>
      <p className="text-neutral-600 mb-6">
        Some of our tent, decoration and lighting setups. Tap any photo to see it full size.
      </p>

      {/* Scrolls sideways on phones instead of stacking into five rows */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible sm:mb-10">
        <button type="button" onClick={() => setActiveId('all')} className={chipClass(activeId === 'all')}>
          All
        </button>

        {gallery.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={chipClass(activeId === item.id)}
          >
            {item.caption}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
