// Plain data and helpers, no React: the build plugin imports this in Node as well as the browser.
import { business, site } from '../content.js'

// "https://example.com/contact" for "/contact". Empty until site.url is set.
export const absolute = (path) => (site.url ? site.url.replace(/\/$/, '') + path : '')

// Profiles that are really the client's. Add the Google Business Profile link (business.mapsUrl) and the
// Justdial page here as they exist: they tie the website, the map listing and the directories together.
const sameAs = [business.instagram, business.facebook, business.mapsUrl].filter(Boolean)

// The business as schema.org structured data. Pages reuse it in their own `jsonLd`.
// Add `openingHoursSpecification` and `geo` only once the client has confirmed the hours and the pin
// (no "24x7" unless he says so), and keep `address` word for word the same as the Google Business Profile.
export const businessLd = {
  '@type': ['TravelAgency', 'TaxiService'],
  ...(site.url ? { '@id': `${absolute('/')}#business` } : {}),
  name: business.name,
  description: site.description,
  telephone: business.phone,
  areaServed: [
    { '@type': 'City', name: 'Raipur' },
    { '@type': 'AdministrativeArea', name: 'Chhattisgarh' },
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Raipur', addressRegion: 'Chhattisgarh', addressCountry: 'IN' },
  ...(site.url ? { url: absolute('/'), logo: absolute('/logo.png'), image: absolute(site.ogImage.path) } : {}),
  ...(sameAs.length ? { sameAs } : {}),
  ...(business.mapsUrl ? { hasMap: business.mapsUrl } : {}),
}

// Tells Google the site's name (shown next to the icon in search results). Home page only.
export const websiteLd = {
  '@type': 'WebSite',
  name: business.name,
  alternateName: `${business.name} Raipur`,
  ...(site.url ? { url: absolute('/') } : {}),
}
