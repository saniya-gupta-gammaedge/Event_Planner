import { whatsappLink } from '../data/company'

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 text-white px-4 py-3 shadow-lg hover:bg-green-600 transition-colors"
    >
      <span className="text-xl">💬</span>
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  )
}
