import { company } from '../data/company'
import anilPhoto from '../assets/photos/anil-dhote.jpg'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-left">
      <h1 className="font-display text-3xl font-bold text-maroon mb-8 text-center">About Us</h1>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="text-center shrink-0">
          <img
            src={anilPhoto}
            alt="Anil Kumar Dhote"
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-lg object-cover shadow-md border-4 border-gold"
          />
          <p className="font-display text-lg font-semibold text-maroon mt-2">Anil Kumar Dhote</p>
          <p className="text-sm text-neutral-500">Owner</p>
        </div>
        <div className="space-y-4">
          <p className="text-neutral-700">
            {company.name} is run by {company.owners.join(' and ')}, based in Betul. We provide
            tent, decoration, sound, lighting and generator services for weddings, birthdays,
            jagran, meetings and all kinds of functions.
          </p>
          <p className="text-neutral-700">
            We take care of the gate, passage, stage and full hall decoration, along with DJ sound
            and lighting. We also give generators of different sizes on rent, so your event never
            stops for power.
          </p>
          <p className="text-neutral-700">
            Call or WhatsApp us to talk about your event and get a price.
          </p>
        </div>
      </div>
    </div>
  )
}
