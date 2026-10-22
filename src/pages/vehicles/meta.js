import { vehicles } from '../../content.js'
import { absolute } from '../../lib/seo.js'

export default {
  path: '/vehicles',
  title: vehicles.title,
  description: vehicles.description,
  nav: { label: 'Vehicles', order: 20 },
  jsonLd: {
    '@type': 'CollectionPage',
    name: vehicles.title,
    description: vehicles.description,
    ...(absolute('/vehicles') ? { url: absolute('/vehicles') } : {}),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: vehicles.items.map((v, i) => ({ '@type': 'ListItem', position: i + 1, name: v.name })),
    },
  },
}
