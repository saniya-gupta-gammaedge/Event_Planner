import { useLocation } from 'react-router-dom'
import { whatsappLink } from '../data/company'
import { useQuote } from '../context/QuoteContext'

export default function WhatsAppButton() {
  const { pathname } = useLocation()
  const { quoteItems } = useQuote()

  // Sit above the rent page's mobile quote bar rather than behind it.
  const raised = pathname === '/rent' && quoteItems.length > 0

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Message us on WhatsApp"
      className={`fixed right-5 z-50 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all flex items-center justify-center text-2xl ${
        raised ? 'bottom-24 lg:bottom-5' : 'bottom-5'
      }`}
    >
      💬
    </a>
  )
}
