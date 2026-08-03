import { NavLink } from 'react-router-dom'
import { company } from '../data/company'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Photos' },
  { to: '/videos', label: 'Videos' },
  { to: '/rent', label: 'Rent' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-cream border-b-2 border-gold">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <NavLink to="/" className="font-display text-lg sm:text-2xl font-bold text-maroon tracking-wide">
          {company.name}
        </NavLink>
        <ul className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm font-medium text-neutral-700">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'text-maroon font-semibold' : 'hover:text-maroon transition-colors'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
