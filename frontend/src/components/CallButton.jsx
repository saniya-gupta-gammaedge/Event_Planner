import { callLink } from '../data/company'

export default function CallButton() {
  return (
    <a
      href={callLink()}
      aria-label="Call us"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-maroon text-gold-light px-4 py-3 shadow-lg hover:bg-maroon-dark transition-colors border border-gold"
    >
      <span className="text-xl">📞</span>
      <span className="hidden sm:inline text-sm font-medium">Call Now</span>
    </a>
  )
}
