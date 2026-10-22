import { business } from '../content.js'
import { LinkButton } from './Button.jsx'
import { PhoneIcon } from './Icons.jsx'
import { contactLink, telLink } from '../lib/links.js'
import { h2 } from './ui.js'

// The closing call to action of the home and trips pages. The enquiry form lives on its own page, /contact.
export default function BookBand() {
  return (
    <section className="bg-plate text-asphalt">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>Ready to book?</h2>
        <p className="mt-4 max-w-[44ch] text-lg">
          Tell us where you are going and when, and we will quote the best price. Your details open in
          WhatsApp, ready to send.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton stack variant="ink" href={contactLink({ lane: 'trip' })}>
            Tell us about your trip
          </LinkButton>
          <LinkButton stack variant="line" href={telLink} icon={<PhoneIcon />}>
            Call {business.phoneDisplay}
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
