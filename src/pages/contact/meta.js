import { absolute, businessLd } from '../../lib/seo.js'
import { contact } from './content.js'

export default {
  path: '/contact',
  title: contact.title,
  description: contact.description,
  nav: { label: 'Contact', order: 90 },
  stickyBar: false, // the page has its own call and WhatsApp buttons, and the bar would cover Send
  jsonLd: {
    '@type': 'ContactPage',
    name: contact.title,
    description: contact.description,
    ...(absolute('/contact') ? { url: absolute('/contact') } : {}),
    mainEntity: businessLd,
  },
}
