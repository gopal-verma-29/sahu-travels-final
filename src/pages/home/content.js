import { tours } from '../../content.js'

// Copy that belongs to the home page only. Facts about the business (vehicles, Dinesh's story,
// trips) are read from src/content.js, so the home page, /vehicles and /about always agree.

export const servicesSection = {
  title: 'What you can book',
}

export const fleetSection = {
  title: 'Pick a vehicle',
  intro:
    'Not sure which size you need? Tell us how many people are travelling and how much luggage you have, and we will suggest one.',
}

// A sequence, so these steps are numbered. Wording stays within what the site already says:
// the message opens in WhatsApp, we quote, and nothing is booked by sending it.
export const how = {
  title: 'How it works',
  steps: [
    {
      name: 'Message us',
      text: 'Send the route, the date and how many people are travelling. WhatsApp opens with your message ready.',
    },
    {
      name: 'Get your quote',
      text: 'We reply with the best price for your trip and suggest the right vehicle.',
    },
    {
      name: 'Confirm and travel',
      text: 'If the quote suits you, we confirm the vehicle for your date. Sending a message does not book anything.',
    },
  ],
}

// The four trips shown on the home page: the nearest, plus the two most visited and the big
// waterfall. Looked up by slug, so distances and notes stay in one place. /trips lists all of them.
const homeTourSlugs = ['rajim', 'sirpur', 'barnawapara', 'chitrakote']
export const homeTours = homeTourSlugs.map((slug) => tours.find((t) => t.slug === slug)).filter(Boolean)
