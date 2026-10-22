import { tours, tripsPage } from '../../content.js'
import { absolute } from '../../lib/seo.js'

export default {
  path: '/trips',
  title: tripsPage.title,
  description: tripsPage.description,
  nav: { label: 'Trips', order: 30 },
  jsonLd: {
    '@type': 'CollectionPage',
    name: tripsPage.title,
    description: tripsPage.description,
    ...(absolute('/trips') ? { url: absolute('/trips') } : {}),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tours.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Raipur to ${t.name}`,
        ...(absolute('/trips') ? { url: `${absolute('/trips')}#${t.slug}` } : {}),
      })),
    },
  },
}
