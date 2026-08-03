import { gallery } from '../data/gallery'
import GalleryCard from '../components/GalleryCard'

export default function Gallery() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-maroon mb-2">Our Work</h1>
      <p className="text-neutral-600 mb-10">Some of our tent, decoration and lighting setups.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
