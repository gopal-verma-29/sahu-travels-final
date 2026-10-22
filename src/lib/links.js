import { business } from '../content.js'

// wa.me opens the WhatsApp app on phones and WhatsApp Web on desktop,
// with the message already typed in.
export const waLink = (text) =>
  `https://wa.me/${business.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const telLink = `tel:${business.phone}`

// "Hi <business>, <what>" — keeps every prefilled message worded the same way.
export const askAbout = (what) => waLink(`Hi ${business.name}, ${what}`)

// Files in /public live at the site root, whichever page is open. A bare "logo.svg" would be read
// relative to the current page and break on /contact, so anchor it to the root.
export const assetUrl = (path) => (/^(\/|https?:|data:)/.test(path) ? path : `/${path}`)

// The one way to link to the contact page. Every contact button on the site is built here, so the
// address and the words the page understands (?lane= now|trip|group|booked, ?to=, ?vehicle=) live in one place.
export const contactLink = ({ lane, to, vehicle } = {}) => {
  const q = new URLSearchParams()
  if (lane) q.set('lane', lane)
  if (to) q.set('to', to)
  if (vehicle) q.set('vehicle', vehicle)
  const query = q.toString()
  return `/contact${query ? `?${query}` : ''}`
}
