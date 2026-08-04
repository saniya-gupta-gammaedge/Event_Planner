import { company, callLink } from '../data/company'

export default function Footer() {
  return (
    <footer className="bg-cream-dark text-neutral-700 border-t-2 border-gold">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-maroon font-semibold text-lg mb-2">{company.name}</h3>
          <p className="text-sm text-neutral-600">{company.tagline}</p>
          <p className="text-sm text-neutral-600 mt-2">{company.owners.join(' & ')}</p>
        </div>
        <div>
          <h4 className="text-maroon font-medium mb-2">Call Us</h4>
          <ul className="text-sm space-y-1 text-neutral-600">
            {company.phones.map((phone) => (
              <li key={phone}>
                <a href={callLink(phone)} className="hover:text-maroon">{phone}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-maroon font-medium mb-2">Address</h4>
          <p className="text-sm text-neutral-600">{company.address}</p>
        </div>
      </div>
      <div className="border-t border-gold/40 text-center text-xs text-neutral-500 py-4">
        © {new Date().getFullYear()} {company.name}
      </div>
    </footer>
  )
}
