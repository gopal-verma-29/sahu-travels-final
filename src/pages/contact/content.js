import { business } from '../../content.js'

// Copy for the /contact page. Each lane is one reason to get in touch. `fields` picks the questions in the
// order they are asked (the question catalogue is in message.js), `required` lists the ones that must be
// filled before WhatsApp opens, and `labels` renames a question for that lane only (the new name is
// also what the WhatsApp message prints). `opening` is the first line of the message.
// The Hindi labels are drafts: have the client read them, then set `confirmed.contactPage` (in src/content.js).
// Links such as /contact?lane=booked open a lane directly, so the business can paste them into
// its own WhatsApp replies.
export const contact = {
  title: `Book a cab or get in touch | ${business.name}`,
  description: `Book a cab now, plan a trip, arrange cars for a wedding or group, or get help with a booking from ${business.name} in Raipur. Message on WhatsApp or call.`,
  heading: 'How can we help?',
  lead: 'Pick what fits. Your details open in WhatsApp as a message, ready to send. This website does not store what you type.',
  quick: 'I have a question.', // message behind the plain "WhatsApp us" button
  previewLabel: 'Message preview', // small label over the on-page preview of the WhatsApp message (wide screens)
  defaultLane: 'trip',
  lanes: [
    {
      id: 'now',
      hindi: 'अभी कैब चाहिए',
      label: 'Need a cab now',
      blurb: 'Pickup from the airport, a station or anywhere in Raipur.',
      opening: 'I need a cab now.',
      fields: ['pickup', 'going', 'pax', 'name', 'note'],
      required: ['pickup'],
    },
    {
      id: 'trip',
      hindi: 'ट्रिप प्लान करें',
      label: 'Plan a trip',
      blurb: 'A day trip, an outstation run or a tour. We quote the best price.',
      opening: "I'd like the best price for a trip.",
      fields: ['from', 'going', 'date', 'tripType', 'pax', 'vehicle', 'name', 'note'],
      required: ['going'],
    },
    {
      id: 'group',
      hindi: 'शादी या ग्रुप',
      label: 'Wedding or group',
      blurb: 'Several cars, a tempo traveller, or a few days booked together.',
      opening: "I'd like a quote for cars for a wedding, event or group.",
      fields: ['date', 'days', 'going', 'pax', 'vehicles', 'name', 'note'],
      labels: { date: 'First date', going: 'Venue or places to cover', pax: 'Total passengers' },
      required: ['date'],
    },
    {
      id: 'booked',
      hindi: 'मेरी बुकिंग',
      label: 'I already booked',
      blurb: 'Driver details, a change of time or place, or anything about a booking.',
      opening: 'I have a booking and need some help.',
      fields: ['help', 'name', 'date', 'note'],
      labels: { name: 'Name on the booking', date: 'Travel date' },
      required: ['name'],
    },
  ],
}
