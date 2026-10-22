// Plain data and helpers, no React: the build plugin imports this in Node as well as the browser.
import { business, site } from '../content.js'

// "https://example.com/contact" for "/contact". Empty until site.url is set.
export const absolute = (path) => (site.url ? site.url.replace(/\/$/, '') + path : '')

// The business as schema.org structured data. Pages reuse it in their own `jsonLd`.
export const businessLd = {
  '@type': ['TaxiService', 'LocalBusiness'],
  name: business.name,
  description: site.description,
  telephone: business.phone,
  areaServed: 'Chhattisgarh, India',
  address: { '@type': 'PostalAddress', addressLocality: 'Raipur', addressRegion: 'Chhattisgarh', addressCountry: 'IN' },
  ...(site.url ? { url: site.url } : {}),
}
