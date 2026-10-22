// Everything the client may want to change lives in this file. Components hold no copy.
//
// Values marked "placeholder" are stand-ins. Replace them, then set the matching flag in
// `confirmed` (bottom of this file) to true. `npm run build` refuses to run until every flag is
// true and both phone numbers are valid, so a fake number can never go live by accident.
// For a client preview that still has placeholders, use `npm run build:demo`.

export const business = {
  name: 'Sahu Travels', // placeholder: the client's business name
  logo: 'favicon.svg', // e.g. '/logo.svg' (put the file in /public). Empty shows the milestone mark.
  whatsapp: '919399059038', // placeholder: 91 + ten-digit mobile, digits only
  phone: '+919399059038', // placeholder: +91 + ten-digit mobile
  phoneDisplay: '+91 93990 59038', // placeholder: how the number is printed on the page
  address: 'Changorabhata, Raipur, Chhattisgarh', // placeholder: add street and landmark
  mapsUrl: '', // optional: a Google Maps share link adds an "Open in Google Maps" link
}

export const site = {
  url: 'https://raipurcabs.in', // set to the live address (https://...) to add canonical and share-preview tags
  title: `Cab and tempo traveller rental in Raipur | ${business.name}`,
  description:
    'Book a cab, SUV or tempo traveller in Raipur for airport pickups, outstation trips and tours across Chhattisgarh. Message on WhatsApp or call for the best price.',
  credit: { text: 'Website by Zyvora Studio', href: 'https://zyvora.studio' }, // set to null to remove
}

export const hero = {
  headline: ['रायपुर से', 'कहीं भी'], // "From Raipur, anywhere"
  srHeading: 'Cab and tempo traveller rental in Raipur',
  lead: 'Cabs, SUVs and tempo travellers for airport pickups, outstation trips and tours.',
}

export const services = [
  {
    name: 'Airport and railway pickups',
    text: 'Pickup and drop at Raipur airport and the railway stations.',
  },
  {
    name: 'Outstation trips',
    text: 'One-way and round trips to other cities in Chhattisgarh and beyond.',
  },
  {
    name: 'Tours and pilgrimages',
    text: 'Day trips and multi-day tours to the places below, or anywhere you plan to go.',
  },
  {
    name: 'Weddings and events',
    text: 'Cars for the family, the guests and the wedding party, booked for the day.',
  },
  {
    name: 'Groups and families',
    text: 'Tempo travellers and SUVs for larger groups, with room for everyone’s luggage.',
  },
  {
    name: 'City rental',
    text: 'A car with a driver for meetings, shopping and errands around Raipur.',
  },
]

// `id` picks the silhouette in Vehicle.jsx: hatchback, sedan, suv or tempo.
export const fleet = [
  {
    id: 'hatchback',
    name: 'Hatchback',
    similar: 'Swift, WagonR or similar',
    seats: '4 passengers',
    luggage: '1 or 2 bags',
    goodFor: 'City trips and short rides',
    want: 'a hatchback',
  },
  {
    id: 'sedan',
    name: 'Sedan',
    similar: 'Dzire, Etios or similar',
    seats: '4 passengers',
    luggage: '2 or 3 bags',
    goodFor: 'Airport pickups and outstation trips',
    want: 'a sedan',
  },
  {
    id: 'suv',
    name: 'SUV or MPV',
    similar: 'Ertiga, Innova or similar',
    seats: '6 or 7 passengers',
    luggage: '3 or 4 bags',
    goodFor: 'Family trips and tours',
    want: 'an SUV or MPV',
  },
  {
    id: 'tempo',
    name: 'Tempo traveller',
    similar: 'Force Traveller or similar',
    seats: '12 to 17 passengers',
    luggage: 'Space for group luggage',
    goodFor: 'Groups, pilgrimages and weddings',
    want: 'a tempo traveller',
  },
]

// Approximate road kilometres from Raipur, rounded to the nearest 5. Sorted nearest first.
// Sources disagree (Chitrakote by 25 km or more), so check each on Google Maps before launch.
//
// `slug` is permanent: it is the #anchor on /trips that customers get in shared WhatsApp links.
// Never rename it; add a new entry or an alias instead.
//
// Fields the /trips page may add (all optional, shown only when present, so nothing placeholder
// ever reaches the page). Each needs a source or the client's word before it is filled in:
//   driveTime  'about 1 hr 15 min'      checked on Google Maps, or from the driver's own experience
//   summary    two or three plain sentences about the place
//   highlights [{ name, text, source }] what there is to see; `source` is the https:// page that says so
//   bestSeason 'October to March'       only if confirmed
//   suits      ['sedan', 'suv']         ids from `fleet`, only if the client said so (checked by the guard)
//   sources    ['https://...']          where the facts came from
//   verified   { driveTime, facts }     true only once a person has checked it (km is covered by confirmed.tours)
export const tours = [
  {
    slug: 'rajim',
    name: 'Rajim',
    km: 45,
    trip: 'Day trip',
    note: 'Rajiv Lochan temple and the Triveni Sangam, where the Mahanadi, Pairi and Sondur rivers meet.',
  },
  {
    slug: 'sirpur',
    name: 'Sirpur',
    km: 80,
    trip: 'Day trip',
    note: 'The Laxman Temple and ancient Buddhist monasteries beside the Mahanadi.',
  },
  {
    slug: 'barnawapara',
    name: 'Barnawapara',
    km: 100,
    trip: 'Day trip',
    note: 'A wildlife sanctuary with leopards, sloth bears, gaur and many kinds of deer.',
  },
  {
    slug: 'dongargarh',
    name: 'Dongargarh',
    km: 110,
    trip: 'Day trip',
    note: 'The hilltop Maa Bamleshwari temple, with a ropeway to the top.',
  },
  {
    slug: 'bhoramdeo',
    name: 'Bhoramdeo',
    km: 135,
    trip: 'Day trip',
    note: '11th-century stone temples, often called the Khajuraho of Chhattisgarh.',
  },
  {
    slug: 'chitrakote',
    name: 'Chitrakote',
    km: 300,
    trip: '2 days or more',
    note: 'A wide waterfall on the Indravati river, often called the Niagara of India.',
  },
  {
    slug: 'mainpat',
    name: 'Mainpat',
    km: 390,
    trip: '2 days or more',
    note: 'A hill station in Surguja with waterfalls, viewpoints and Ulta Pani, where water seems to flow uphill.',
  },
]

// The last milestone on the trips list: the open invitation.
export const anywhere = {
  name: 'Anywhere',
  km: '?',
  trip: 'Not listed?',
  note: 'Tell us the place and the date, and we will quote it.',
}

// ---------------------------------------------------------------------------------------
// About page (/about). The story is Dinesh Sahu's own words, so keep it to what he has
// confirmed: no years in business, reviews, awards or guarantees unless he supplies them.
// When the next vehicle arrives: set `nextVehicle` to '' and raise `fleetSize` by one.
// Every sentence that mentions a count or a date is built from the four values below.
// ---------------------------------------------------------------------------------------
const startedDriving = 1998
const firstCar = 2019
const fleetSize = 6
const nextVehicle = 'Diwali 2026' // '' once it has arrived

const cardinal = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const ordinal = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth']
const sentenceCase = (w) => w.charAt(0).toUpperCase() + w.slice(1)
const fleetWord = cardinal[fleetSize] ?? String(fleetSize)
const nextWord = cardinal[fleetSize + 1] ?? String(fleetSize + 1)
const nextOrdinal = ordinal[fleetSize + 1] ?? `${fleetSize + 1}th`

export const about = {
  title: `About ${business.name} | Cab and tempo traveller rental in Raipur`,
  description: `Dinesh Sahu started driving in ${startedDriving} and bought his first car in ${firstCar}. Today ${business.name} runs ${fleetWord} vehicles in Raipur, Chhattisgarh. Message on WhatsApp or call for the best price.`,
  founder: 'Dinesh Sahu',

  headline: ['ड्राइवर से', 'मालिक तक'], // "From driver to owner"
  srHeading: `About ${business.name}: from driver to owner`,
  lead: `Dinesh Sahu has been driving since ${startedDriving}. Today ${business.name} runs ${fleetWord} vehicles in Raipur${
    nextVehicle ? `, and a ${nextOrdinal} is planned for ${nextVehicle}` : ''
  }.`,

  // Files live in /public/images/about: dinesh-sahu-480|720|896.avif and dinesh-sahu.jpg
  portrait: {
    src: '/images/about/dinesh-sahu',
    width: 896,
    height: 1120,
    alt: `Dinesh Sahu, founder of ${business.name}, in a blue blazer beside a white Toyota decorated with a marigold garland`,
    caption: 'Dinesh Sahu',
    role: `Founder of ${business.name}`,
  },

  journey: {
    title: 'The road so far',
    intro: 'From the driver’s seat to a fleet of his own.',
  },
  // `when` is read aloud; the stone shows `value` (an odometer) and `unit`. `from` is where the
  // odometer starts rolling. `planned` draws a dashed stone for something that has not happened yet.
  milestones: [
    {
      when: String(startedDriving),
      value: startedDriving,
      label: 'Driver',
      title: 'Behind the wheel',
      text: 'Dinesh Sahu starts out as a driver.',
    },
    {
      when: String(firstCar),
      value: firstCar,
      label: 'First car',
      title: 'A car of his own',
      text: 'He buys his first car and never looks back.',
    },
    {
      when: 'Today',
      value: fleetSize,
      unit: 'vehicles',
      label: 'Today',
      title: `${sentenceCase(fleetWord)} vehicles`,
      text: 'A strong base across Raipur, and drivers he can call on.',
    },
    ...(nextVehicle
      ? [
          {
            when: nextVehicle,
            value: fleetSize + 1,
            from: fleetSize,
            unit: 'vehicles',
            label: 'Next',
            title: `Number ${nextWord}`,
            text: `A ${nextOrdinal} vehicle is planned for ${nextVehicle}.`,
            planned: true,
          },
        ]
      : []),
  ],

  why: {
    title: `Why book with ${business.name}`,
    points: [
      {
        name: 'An owner who started as a driver',
        text: `Dinesh Sahu has worked as a driver since ${startedDriving}. He knows the job from the driver’s seat.`,
      },
      {
        name: 'A fleet that grew car by car',
        text: `One car in ${firstCar}, ${fleetWord} vehicles today${nextVehicle ? `, and a ${nextOrdinal} planned for ${nextVehicle}` : ''}.`,
      },
      {
        name: 'Drivers he can call on',
        text: 'Alongside the fleet, Dinesh has a network of driver contacts.',
      },
      {
        name: 'Rooted in Raipur',
        text: 'A strong base across Raipur and the rest of Chhattisgarh.',
      },
    ],
  },

  // `kind` picks the silhouette in Vehicle.jsx. Silhouettes are generic, not the exact models.
  // Add `count: 2` to a type once Dinesh confirms how many of each he has; it shows as "x2".
  fleet: {
    title: 'The fleet today',
    intro: '5-seater and 7-seater cars, Innova, Traveller and Urbania. Tell us your group size and we will suggest the right one.',
    types: [
      { name: '5-seater', kind: 'sedan' },
      { name: '7-seater', kind: 'suv' },
      { name: 'Innova', kind: 'suv' },
      { name: 'Traveller', kind: 'tempo' },
      { name: 'Urbania', kind: 'tempo' },
    ],
    next: nextVehicle ? { title: `Coming at ${nextVehicle}`, text: 'One more joins the fleet.' } : null,
  },

  cta: {
    title: 'Planning a trip?',
    text: 'Tell us where you are going and when, and we will quote the best price.',
    ask: "I'd like the best price for a trip.",
  },
}

// Vehicles page (/vehicles). One entry per vehicle, in the order the page shows them (smallest first).
// Copy sticks to what the photos and the model itself show: no prices, no invented counts or guarantees.
// `photos` are names in /public/images/vehicles (made by scripts/make-vehicle-images.py); an empty
// list shows the silhouette `kind` with an "ask for photos" link instead.
const ph = (n, alt, maxW) => ({ n, alt, ...(maxW ? { maxW } : {}) })
export const vehicles = {
  title: `Vehicles for hire in Raipur: Dzire, Innova, Urbania, Traveller and Monobus | ${business.name}`,
  description: `See the Swift Dzire, Ertiga, Innova Crysta, Innova Hycross, Urbania, 17-seater Traveller and 26-seater Monobus you can hire in Raipur with ${business.name}. Message on WhatsApp or call for the best price.`,
  headline: ['सफ़र के लिए', 'सही गाड़ी'], // "The right vehicle for the trip"
  srHeading: 'Vehicles for hire in Raipur',
  lead: 'From a compact Dzire to a 26-seater Monobus. Pick the one that fits your group, or tell us how many are travelling and we will suggest it.',
  finder: {
    title: 'How many are travelling?',
    intro: 'Tap a vehicle to jump to its photos. Not sure? Message us your group size and the date.',
    rows: [
      { group: '1 to 4 people', ids: ['dzire'] },
      { group: '5 to 7 people', ids: ['ertiga', 'crysta', 'hycross'] },
      { group: '8 to 17 people', ids: ['urbania', 'traveller'] },
      { group: 'Up to 26 people', ids: ['monobus'] },
    ],
  },
  items: [
    {
      id: 'dzire', name: 'Swift Dzire', make: 'Maruti Suzuki sedan', kind: 'sedan', want: 'a Swift Dzire',
      badge: ['5', 'seats'], seatLabel: '5-seater', seats: '5-seater',
      goodFor: 'Airport pickups, city rides, couples and small families',
      text: 'The easy pick for city rides, airport pickups and short outstation runs. Compact enough for Raipur’s lanes, with a boot for your bags.',
      features: ['Air-conditioned', 'Boot for bags', 'Easy in city traffic'],
      photos: [ph('dzire-1', 'Swift Dzire, front view'), ph('dzire-2', 'Swift Dzire with a marigold garland')],
    },
    {
      id: 'ertiga', name: 'Ertiga', make: 'Maruti Suzuki MPV', kind: 'suv', want: 'an Ertiga',
      badge: ['7', 'seats'], seatLabel: '7-seater', seats: '7-seater',
      goodFor: 'Family trips, temple visits and weekend tours',
      text: 'A plain, comfortable 7-seater for family trips. Three rows keep everyone together, and it suits a day out or a weekend away.',
      features: ['Air-conditioned', 'Three rows of seats', 'Family-friendly'],
      photos: [ph('ertiga-1', 'Ertiga, side view', 560)],
    },
    {
      id: 'crysta', name: 'Innova Crysta', make: 'Toyota MPV', kind: 'suv', want: 'an Innova Crysta',
      badge: ['7–8', 'seats'], seatLabel: '7–8 seater', seats: '7 or 8 seater',
      goodFor: 'Outstation trips, pilgrimages and families with luggage',
      text: 'The long-distance favourite. Roomy three-row seating and a steady ride on the highway. Pick it when the trip is long or the luggage is heavy.',
      features: ['Air-conditioned', 'Roomy three rows', 'Made for long drives'],
      photos: [ph('crysta-1', 'Innova Crysta, side view'), ph('crysta-2', 'Innova Crysta, front view'), ph('crysta-3', 'Grey Innova Crysta with a marigold garland')],
    },
    {
      id: 'hycross', name: 'Innova Hycross', make: 'Toyota MPV, the newer Innova', kind: 'suv', want: 'an Innova Hycross',
      badge: ['7–8', 'seats'], seatLabel: '7–8 seater', seats: '7 or 8 seater',
      goodFor: 'Weddings and guests, business travel and family trips',
      text: 'The same roomy 7–8 seats as the Crysta, with a sharper, better-looking front and a slightly more premium feel. Good when you want to arrive in style.',
      features: ['Air-conditioned', 'Newer, sleeker look', 'Roomy three rows'],
      photos: [ph('hycross-1', 'Innova Hycross, side view'), ph('hycross-2', 'Innova Hycross, front view')],
    },
    {
      id: 'urbania', name: 'Urbania', make: 'Force Urbania, premium group van', kind: 'tempo', want: 'an Urbania',
      badge: ['Lux', 'van'], seatLabel: 'premium van', seats: 'Layout varies, tell us your group size',
      goodFor: 'Family groups, corporate travel, group airport transfers and tours',
      text: 'Our premium van. Big windows, a high roof and a sliding side door make it easy to get in and comfortable over a long day. Built for groups who want to travel well together.',
      features: ['Air-conditioned', 'Big windows', 'Sliding side door'],
      photos: [ph('urbania-1', 'Force Urbania, side view'), ph('urbania-2', 'Force Urbania with the sliding door open'), ph('urbania-3', 'Urbania cabin with blue seats')],
    },
    {
      id: 'traveller', name: '17-seater Traveller', make: 'Force Traveller tempo traveller', kind: 'tempo', want: 'a 17-seater Traveller',
      badge: ['17', 'seats'], seatLabel: '17-seater', seats: '17-seater',
      goodFor: 'Pilgrimages, weddings, office and school outings, group tours',
      text: 'The classic tempo traveller for groups. High roof, curtained windows and a long aisle, so a big family or a whole office can travel in one vehicle.',
      features: ['Air-conditioned', 'High roof', 'Curtained windows'],
      photos: [ph('traveller-1', 'Force Traveller, side view'), ph('traveller-2', 'Traveller cabin with seats and curtains'), ph('traveller-3', 'Force Traveller, side view indoors')],
    },
    {
      id: 'monobus', name: '26-seater Monobus', make: 'Force Traveller Monobus', kind: 'tempo', want: 'a 26-seater Monobus',
      badge: ['26', 'seats'], seatLabel: '26-seater', seats: '26-seater',
      goodFor: 'Big weddings, company trips, society groups and pilgrimage tours',
      text: 'For when the group is too big for a Traveller. A single-deck, bus-style body with large windows, so 26 people can travel in one vehicle.',
      features: ['Air-conditioned', 'Large windows', 'Whole group in one vehicle'],
      photos: [ph('monobus-1', 'Traveller Monobus, front view'), ph('monobus-2', 'Traveller Monobus, side view')],
    },
  ],
  cta: {
    title: 'Not sure which one fits?',
    text: 'Tell us how many are travelling, the date and where you are going. We will suggest a vehicle and quote the best price.',
    ask: "I'd like the best price for a trip. Can you suggest the right vehicle?",
  },
}

// Copy for the /trips page. Title and description feed <title>, the share preview and search results.
export const tripsPage = {
  title: `Trips from Raipur by cab | ${business.name}`,
  description: `Day trips and tours from Raipur by cab or tempo traveller, from ${tours[0].name} to ${tours.at(-1).name}. Tell us your dates on WhatsApp and we will quote the best price.`,
  h1: 'Trips from Raipur',
  lead: 'Pick a place to see the distance and what is there, then message us your dates for a quote.',
  // Explains why there is no price list. General only: it must not say what a quote includes
  // (tolls, driver stay) until the client confirms it. If he does, add `included: '...'` here.
  quoteHeading: 'What decides your quote',
  quoteLead: 'We do not list fixed prices. Send us these details on WhatsApp and we will quote the best price for your trip.',
  quoteFactors: [
    { name: 'The route', text: 'Where you are going and how many kilometres the trip covers.' },
    { name: 'The vehicle', text: 'How many people are travelling and how much luggage you have.' },
    { name: 'One way or round trip', text: 'And how many days you need the vehicle.' },
    { name: 'Your dates', text: 'The day you travel, so we can confirm the vehicle is free.' },
  ],
}

// Launch checklist. Flip each to true once the matching content above is the client's real content.
export const confirmed = {
  name: true, // business.name and logo
  contact: true, // business.whatsapp, phone, phoneDisplay
  address: true, // business.address (and mapsUrl if wanted)
  services: true, // services list matches what the client offers
  fleet: true, // fleet list matches the vehicles the client really has
  tours: true, // trips and distances checked on Google Maps
  contactPage: false, // /contact lane names, Hindi labels and message wording read by the client
  about: false, // Dinesh has read the /about story, fleet list and photo, and approved them
  vehicles: false, // /vehicles list, seat counts, descriptions and photos match his real vehicles
  trips: false, // trip details and route distances checked/approved
  domain: false, // production domain is live and configured
}
