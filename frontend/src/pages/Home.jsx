import { Link } from 'react-router-dom'
import { whatsappLink, callLink } from '../data/company'
import HeroShowcase from '../components/HeroShowcase'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'

const stats = [
  { id: 'events', value: 500, suffix: '+', label: 'Events Completed' },
  { id: 'years', value: 25, suffix: '+', label: 'Years Experience' },
  { id: 'support', display: '24×7', label: 'Customer Support' },
  { id: 'satisfaction', value: 100, suffix: '%', label: 'Customer Satisfaction' },
]

export default function Home() {
  return (
    <div>
      <HeroShowcase />

      {/* Statistics */}
      <section className="bg-maroon py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-10 text-center md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.id} delay={i * 100}>
                <p className="font-display text-4xl font-bold text-gold sm:text-5xl">
                  {stat.display ?? (
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  )}
                </p>

                <p className="mt-2 text-white/80">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Rent / instant quote */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-cream to-white p-10 text-center sm:p-14">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
                Chairs · Mattresses · Carpets · Generators
              </p>

              <h2 className="font-display mt-4 text-3xl font-bold text-maroon sm:text-4xl">
                Check Rental Prices Instantly
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
                Pick your items, set the quantity and how long you need them,
                and see an estimated price straight away. Send the whole list to
                us on WhatsApp when you are ready.
              </p>

              <Link
                to="/rent"
                className="mt-8 inline-block rounded-xl bg-gold px-8 py-4 font-semibold text-maroon-dark shadow-lg transition hover:bg-gold-light"
              >
                See Prices
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Lawn availability */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="rounded-3xl border-2 border-maroon/20 bg-gradient-to-br from-white to-cream-dark p-10 text-center sm:p-14">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-maroon">
                Lawn For Weddings & Functions
              </p>

              <h2 className="font-display mt-4 text-3xl font-bold text-maroon sm:text-4xl">
                Check Lawn Availability
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
                See which dates are already booked and which are free, then
                reach out to confirm your event date with us.
              </p>

              <Link
                to="/lawn"
                className="mt-8 inline-block rounded-xl bg-maroon px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-maroon-dark"
              >
                View Calendar
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing contact */}
      <section className="bg-cream-dark py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-maroon sm:text-4xl">
              Planning An Event?
            </h2>

            <p className="mt-4 text-neutral-700">
              Tell us the date and what you need — we will arrange the rest.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={callLink()}
                className="rounded-xl bg-maroon px-7 py-4 font-semibold text-white shadow transition hover:bg-maroon-dark"
              >
                📞 Call Now
              </a>

              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-green-600 px-7 py-4 font-semibold text-white shadow transition hover:bg-green-700"
              >
                💬 Message on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

