export const company = {
  name: 'Dhote Tent & Lighting House',
  owners: ['Anil Kumar Dhote', 'Sunil Kumar Dhote'],
  tagline: 'Tent, Lighting, Sound & Generator for your event',
  phones: ['09425381862', '70008 51226', '09425629350'],
  primaryPhone: '09425381862',
  address: 'Jain Dadawadi, Chakkar Road, Betul (M.P.)',
  lawnName: 'Jain Dadawadi',
}

function digitsOnly(phone) {
  return phone.replace(/\D/g, '')
}

export function callLink(phone = company.primaryPhone) {
  return `tel:${digitsOnly(phone)}`
}

export function whatsappLink(message) {
  const defaultMessage = 'Hello, I need your service for my event.'
  const number = digitsOnly(company.primaryPhone)
  const withCountryCode = number.length === 10 ? `91${number}` : number
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message || defaultMessage)}`
}
