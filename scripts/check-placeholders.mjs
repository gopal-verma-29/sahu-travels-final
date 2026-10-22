// Runs before `npm run build`. Stops a build that still carries placeholder
// details, so a fake phone number never reaches the live site.
import { business, confirmed, fleet, site, tours, tripsPage } from '../src/content.js'
import { PLACEHOLDER_RE, PRICE_RE } from './policy.mjs'

const problems = []

// Every launch flag must exist AND be true. Looping over `confirmed` alone would let a deleted flag pass.
const REQUIRED = ['name', 'contact', 'address', 'services', 'fleet', 'tours', 'trips', 'domain']
const open = [...new Set([...REQUIRED, ...Object.keys(confirmed)])].filter((key) => confirmed[key] !== true)
if (open.length) problems.push(`Not confirmed yet in src/content.js: ${open.join(', ')}`)

// Indian mobile in wa.me format: 91 + ten digits starting 6-9.
if (!/^91[6-9]\d{9}$/.test(business.whatsapp)) {
  problems.push(`business.whatsapp "${business.whatsapp}" is not a valid Indian mobile (expected 91XXXXXXXXXX)`)
}
if (!/^\+91[6-9]\d{9}$/.test(business.phone)) {
  problems.push(`business.phone "${business.phone}" is not a valid Indian mobile (expected +91XXXXXXXXXX)`)
}
// The number printed on the page must be the number that is dialled.
if (String(business.phoneDisplay).replace(/\D/g, '').slice(-10) !== String(business.phone).replace(/\D/g, '').slice(-10)) {
  problems.push(`business.phoneDisplay "${business.phoneDisplay}" does not match business.phone "${business.phone}"`)
}

// Canonical URLs, the sitemap and share previews all need the real address.
if (!/^https:\/\/[^/\s]+\.[a-z]{2,}$/i.test(site.url)) {
  problems.push(`site.url "${site.url}" must be the live address without a trailing slash (https://example.in)`)
}

const isUrl = (u) => typeof u === 'string' && /^https:\/\/[^\s/]+\.[^\s]+$/i.test(u)
const fleetIds = new Set(fleet.map((f) => f.id))
const slugs = new Set()

for (const t of tours) {
  // A unique, URL-safe slug: it is the #anchor customers share on WhatsApp.
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug ?? '')) problems.push(`tour "${t.name}" needs a lowercase slug (letters, digits, hyphens)`)
  if (slugs.has(t.slug)) problems.push(`tour slug "${t.slug}" is used twice`)
  slugs.add(t.slug)

  // No money wording and no unfilled placeholders in anything a trip shows.
  const texts = [t.note, t.summary, t.bestSeason, t.driveTime, ...(t.highlights ?? []).flatMap((h) => [h?.name, h?.text])]
  for (const s of texts.filter((x) => typeof x === 'string')) {
    if (PRICE_RE.test(s)) problems.push(`tour "${t.name}": "${s.slice(0, 48)}" mentions money or rates (the site shows no prices)`)
    if (PLACEHOLDER_RE.test(s)) problems.push(`tour "${t.name}": "${s.slice(0, 48)}" looks like an unfilled placeholder`)
  }

  // Anything beyond the basics needs a source and a person's sign-off.
  const extra = ['driveTime', 'summary', 'highlights', 'bestSeason', 'suits'].filter((k) => t[k] != null)
  if (extra.length) {
    if (!t.sources?.length) problems.push(`tour "${t.name}" shows extra details but lists no sources`)
    for (const u of t.sources ?? []) if (!isUrl(u)) problems.push(`tour "${t.name}": source "${u}" is not an https:// URL`)
    const v = t.verified ?? {}
    if (t.driveTime != null && v.driveTime !== true) problems.push(`tour "${t.name}": driveTime is not marked verified`)
    if (['summary', 'highlights', 'bestSeason', 'suits'].some((k) => t[k] != null) && v.facts !== true) {
      problems.push(`tour "${t.name}": summary/highlights/bestSeason/suits are not marked verified`)
    }
  }
  for (const h of t.highlights ?? []) {
    if (!h?.name || !h?.text) problems.push(`tour "${t.name}": every highlight needs a name and text`)
    if (!isUrl(h?.source)) problems.push(`tour "${t.name}": highlight "${h?.name}" needs a source (an https:// URL)`)
  }
  for (const id of t.suits ?? []) {
    if (!fleetIds.has(id)) problems.push(`tour "${t.name}": suits "${id}" is not a vehicle id in \`fleet\` (${[...fleetIds].join(', ')})`)
  }
}

// The /trips page copy follows the same rules.
const pageTexts = [
  tripsPage.title, tripsPage.description, tripsPage.h1, tripsPage.lead, tripsPage.quoteHeading, tripsPage.quoteLead, tripsPage.included,
  ...(tripsPage.quoteFactors ?? []).flatMap((f) => [f.name, f.text]),
].filter((x) => typeof x === 'string')
for (const s of pageTexts) {
  if (PRICE_RE.test(s)) problems.push(`tripsPage: "${s.slice(0, 48)}" mentions money or rates (the site shows no prices)`)
  if (PLACEHOLDER_RE.test(s)) problems.push(`tripsPage: "${s.slice(0, 48)}" looks like an unfilled placeholder`)
}

if (problems.length) {
  console.error('\nNot ready to ship:\n  - ' + problems.join('\n  - '))
  console.error('\nFix the values, set each flag in `confirmed` to true, then build again.')
  console.error('For a client preview that still has placeholders, use: npm run build:demo\n')
  process.exit(1)
}
console.log('Placeholder check passed.')
