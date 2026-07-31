import { company, whatsappLink, callLink } from '../data/company'

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-maroon mb-2">Contact Us</h1>
      <p className="text-neutral-600 mb-8">
        Call us or message us on WhatsApp. We will reply fast.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <a
          href={callLink()}
          className="inline-flex items-center gap-2 rounded-lg bg-maroon text-gold-light border border-gold px-8 py-4 text-lg font-medium hover:bg-maroon-dark transition-colors"
        >
          📞 Call Now
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-green-500 text-white px-8 py-4 text-lg font-medium hover:bg-green-600 transition-colors"
        >
          💬 WhatsApp
        </a>
      </div>

      <div className="border-t border-gold/30 pt-8 text-sm text-neutral-700">
        <h3 className="font-semibold text-maroon mb-2">Phone Numbers</h3>
        <ul className="space-y-1 mb-6">
          {company.phones.map((phone) => (
            <li key={phone}>
              <a href={callLink(phone)} className="hover:text-maroon">{phone}</a>
            </li>
          ))}
        </ul>
        <h3 className="font-semibold text-maroon mb-2">Address</h3>
        <p>{company.address}</p>
      </div>
    </div>
  )
}
