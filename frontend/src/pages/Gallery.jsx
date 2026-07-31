import { gallery } from '../data/gallery'

export default function Gallery() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-maroon mb-2">Our Work</h1>
      <p className="text-neutral-600 mb-10">Some of our tent, decoration and lighting setups.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
          <div key={item.id} className="rounded-xl overflow-hidden shadow-sm border border-gold/30">
            <img
              src={item.src}
              alt={item.caption}
              className="w-full h-56 object-cover"
            />
            <p className="text-sm font-medium text-maroon bg-white p-2 text-center">
              {item.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
