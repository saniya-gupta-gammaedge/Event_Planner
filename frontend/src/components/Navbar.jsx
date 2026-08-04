import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { company } from '../data/company'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Photos' },
  { to: '/videos', label: 'Videos' },
  { to: '/rent', label: 'Rent' },
  { to: '/about', label: 'About' },
]

const linkClass = ({ isActive }) =>
  isActive ? 'text-maroon font-semibold' : 'hover:text-maroon transition-colors'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the menu whenever we land on a new page.
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40 bg-cream border-b-2 border-gold">
      <nav className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            className="font-display text-lg sm:text-2xl font-bold text-maroon tracking-wide"
          >
            {company.name}
          </NavLink>

          <ul className="hidden md:flex gap-5 text-sm font-medium text-neutral-700">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((isOpen) => !isOpen)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden -mr-2 px-3 py-1 text-2xl text-maroon"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {open && (
          <ul className="md:hidden mt-3 border-t border-gold/40 pt-3 text-neutral-700">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={(state) => `block py-2 font-medium ${linkClass(state)}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
