import services from '../data/services.json'
import ServiceCard from '../components/ServiceCard'

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-maroon mb-2">Our Services</h1>
      <p className="text-neutral-600 mb-10">
        Whatever the occasion, we handle the planning so you don't have to.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  )
}
