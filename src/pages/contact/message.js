import { business, fleet } from '../../content.js'

export const VEHICLES = ['Not sure, suggest one', ...fleet.map((v) => v.name)]

export function prettyDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const part = Object.fromEntries(
    new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      .formatToParts(new Date(y, m - 1, d))
      .map(({ type, value }) => [type, value]),
  )
  return `${part.weekday} ${part.day} ${part.month} ${part.year}`
}

// "Hi <business>, <opening>", a blank line, then one "Key: value" line per answered row.
// Rows the visitor left empty are dropped, so the message reads like a person wrote it.
export function composeMessage(opening, rows) {
  const lines = [`Hi ${business.name}, ${opening}`, '']
  for (const [key, value] of rows) if (value) lines.push(`${key}: ${value}`)
  return lines.join('\n')
}

// Every question the contact lanes can ask. `key` is the word printed in the WhatsApp message;
// `missing` is the error shown when a lane requires the question and it is empty.
export const FIELDS = {
  from: { type: 'text', label: 'Pickup from', key: 'From', initial: 'Raipur' },
  pickup: {
    type: 'text', label: 'Pickup point', key: 'Pickup', placeholder: 'Airport, station or address',
    missing: 'Add where we should pick you up.',
  },
  going: {
    type: 'text', label: 'Going to', key: 'To', placeholder: 'City or place', list: 'places',
    missing: 'Add where you are going so we can quote the trip.',
  },
  date: {
    type: 'date', label: 'Travel date', key: 'Date', format: prettyDate,
    missing: 'Add the date so we can check availability.',
  },
  tripType: { type: 'choice', label: 'Trip type', key: 'Trip', options: ['One way', 'Round trip'], initial: 'One way' },
  days: { type: 'number', label: 'Number of days', key: 'Days', min: 1, max: 30, placeholder: 'How many' },
  pax: { type: 'number', label: 'Passengers', key: 'Passengers', min: 1, max: 60, placeholder: 'How many' },
  vehicle: { type: 'select', label: 'Vehicle', key: 'Vehicle', options: VEHICLES, initial: VEHICLES[0] },
  vehicles: {
    type: 'text', label: 'Vehicles needed', key: 'Vehicles', wide: true,
    placeholder: '2 SUVs and 1 tempo traveller',
  },
  help: {
    type: 'select', label: 'What do you need?', key: 'Need',
    options: [
      'Driver and vehicle details',
      'Change the pickup time or place',
      'Add a stop or extend the trip',
      'Something else',
    ],
    initial: 'Driver and vehicle details',
  },
  name: { type: 'text', label: 'Your name', key: 'Name', autoComplete: 'name', missing: 'Add your name so we know who to look for.' },
  note: { type: 'textarea', label: 'Anything else we should know?', key: 'Note', wide: true },
}

export function initialValues() {
  return Object.fromEntries(Object.entries(FIELDS).map(([id, f]) => [id, f.initial ?? '']))
}

// The rows the visitor has answered, in the order the lane asks them: [{ id, key, value }].
// Both the WhatsApp message and the on-page preview are built from this, so they cannot drift apart.
export function laneRows(lane, values) {
  return lane.fields
    .map((id) => {
      const f = FIELDS[id]
      const raw = String(values[id] ?? '').trim()
      return { id, key: lane.labels?.[id] ?? f.key, value: f.format ? f.format(raw) : raw }
    })
    .filter((row) => row.value)
}

export function buildLaneMessage(lane, values) {
  return composeMessage(
    lane.opening,
    laneRows(lane, values).map((row) => [row.key, row.value]),
  )
}
