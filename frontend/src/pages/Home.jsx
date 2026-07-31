import { Link } from 'react-router-dom'
import { company, whatsappLink } from '../data/company'
import hero from '../assets/photos/stage-lounge-floral.jpg'

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-b from-cream to-gold-light/30 px-4 py-8 sm:py-10 text-center">
        <img
          src={hero}
          alt="Event decoration by Dhote Tent & Lighting House"
          className="mx-auto rounded-2xl w-full max-w-md sm:max-w-lg h-auto mb-5 shadow-lg border-2 border-gold"
        />
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-maroon mb-3">
          {company.name}
        </h1>
        <div className="gold-divider mb-4" />
        <p className="text-neutral-700 max-w-xl mx-auto mb-8">
          {company.tagline}. We handle tent, decoration, sound, lighting and generator for
          weddings and all types of functions in Betul.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-green-500 text-white px-6 py-3 font-medium hover:bg-green-600 transition-colors"
          >
            Message on WhatsApp
          </a>
          <Link
            to="/services"
            className="rounded-lg bg-gold text-maroon-dark px-6 py-3 font-medium hover:bg-gold-light transition-colors"
          >
            See Our Services
          </Link>
        </div>
      </section>
    </div>
  )
}
