// Wording and link helpers for the /trips page. Business facts and trip details stay in src/content.js.
import { site } from '../../content.js'
import { contactLink } from '../../lib/links.js'

// "Get a quote" opens the one contact form on the trip lane with this place already filled in:
// /contact?lane=trip&to=Chitrakote. Without a name it opens the trip lane with nothing chosen.
export const quoteHref = (name) => contactLink({ lane: 'trip', to: name })

// A link customers can send to the family WhatsApp group, where most trips get decided. It carries the
// #anchor of the trip. Uses the live address once site.url is set, the current address until then.
export function shareHref(name, slug) {
  const origin = site.url || (typeof location === 'undefined' ? '' : location.origin)
  const text = `${name} trip from Raipur: ${origin}/trips#${slug}`
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
}

export const ui = {
  quote: 'Get a quote',
  whatsapp: 'WhatsApp',
  call: 'Call now',
  share: (name) => `Share the ${name} trip on WhatsApp`,
  stonesLabel: 'Trips by distance from Raipur',
  roadHeading: 'All trips, nearest first',
  start: 'Raipur',
}
