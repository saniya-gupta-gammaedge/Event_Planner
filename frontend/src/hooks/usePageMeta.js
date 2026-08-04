import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { company } from '../data/company'

const pages = {
  '/': {
    title: 'Tent, Decoration, Lighting & Generator in Betul',
    description:
      'Tent house, wedding and birthday decoration, DJ sound, lighting and generators on rent in Betul (M.P.). 25+ years of experience.',
  },
  '/services': {
    title: 'Our Services',
    description:
      'Gate, passage and stage decoration, DJ sound, lighting, orchestra and meeting setup for events in Betul.',
  },
  '/gallery': {
    title: 'Photos of Our Work',
    description:
      'Photos of our gate, passage, mandap, stage and lighting decoration for weddings and functions in Betul.',
  },
  '/videos': {
    title: 'Event Videos',
    description:
      'Watch our tent, decoration and lighting setups in action at weddings and functions in Betul.',
  },
  '/rent': {
    title: 'Rent Chairs, Mattresses, Carpets & Generators',
    description:
      'Rent chairs, pillows, mattresses, carpets and generators in Betul. Build your own quote and send it on WhatsApp.',
  },
  '/about': {
    title: 'About Us',
    description: `${company.name} is a family-run tent and lighting business in Betul, run by ${company.owners.join(' and ')}.`,
  },
}

/** Keeps the browser tab title and meta description in step with the current route. */
export function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = pages[pathname] ?? pages['/']

    document.title = `${page.title} — ${company.name}`
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', page.description)
  }, [pathname])
}
