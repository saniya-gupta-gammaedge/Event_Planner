import rentals from '../data/rentals.json'
import generators from '../data/generators.json'
import { whatsappLink, callLink } from '../data/company'

export default function Rent() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-maroon mb-2 text-center">Rent Items</h1>
      <p className="text-neutral-600 mb-6 text-center">
        Price depends on how many you need and for how long. Call or WhatsApp us for a rate.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {rentals.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-3 flex items-center gap-3"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium text-neutral-800">{item.title}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-gold/40 p-6 sm:p-8 mb-8">
        <h2 className="font-display text-xl font-semibold text-maroon mb-2">Generator on Rent</h2>
        <p className="text-neutral-600 mb-4">Generators always available for rent, in these sizes:</p>
        <div className="flex flex-wrap gap-3">
          {generators.map((g) => (
            <span
              key={g.id}
              className="rounded-full bg-white border border-gold px-4 py-2 font-medium text-maroon"
            >
              {g.size}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-neutral-700 mb-4">Tell us what you need and for how many days — we'll quote you a price.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={whatsappLink('Hello, I want to know the rent for chairs/beds/generator etc.')}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-green-500 text-white px-6 py-3 font-medium hover:bg-green-600 transition-colors"
          >
            Ask on WhatsApp
          </a>
          <a
            href={callLink()}
            className="rounded-lg bg-gold text-maroon-dark px-6 py-3 font-medium hover:bg-gold-light transition-colors"
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  )
}
