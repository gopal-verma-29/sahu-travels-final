import { business, site } from '../content.js'
import { askAbout, telLink } from '../lib/links.js'
import SocialLinks from './SocialLinks.jsx'

const link = 'underline decoration-wash/40 underline-offset-4 hover:decoration-plate hover:text-plate'

// stickyBar: the phone Call/WhatsApp bar sits over the bottom of the page, so leave room for it.
export default function Footer({ stickyBar = true }) {
  return (
    <footer className="bg-asphalt text-wash [--focus:var(--color-plate)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-[2.4rem] font-semibold leading-none">{business.name}</p>
          <p className="mt-3 max-w-[32ch] text-wash/80">
            Cab, SUV and tempo traveller rental in Raipur, Chhattisgarh.
          </p>
          <nav aria-label="Pages" className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            <a href="/about" className={link}>
              About {business.name}
            </a>
            <a href="/vehicles" className={link}>
              Our vehicles
            </a>
            <a href="/trips" className={link}>
              Popular trips
            </a>
            <a href="/contact" className={link}>
              Contact us
            </a>
          </nav>
        </div>

        <div>
          <h2 className="font-display text-[1.6rem] font-semibold leading-none text-plate">Talk to us</h2>
          <ul className="mt-3 space-y-1.5">
            <li>
              <a href={telLink} className={link}>
                Call {business.phoneDisplay}
              </a>
            </li>
            <li>
              <a href="tel:9826762835" className={link}>
                Call +91 98267 62835
              </a>
            </li>
            <li>
              <a href={askAbout("I'd like the best price for a cab.")} target="_blank" rel="noopener noreferrer" className={link}>
                Message on WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-[1.6rem] font-semibold leading-none text-plate">Find us</h2>
          <address className="mt-3 not-italic text-wash/80">{business.address}</address>
          {business.mapsUrl && (
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className={`${link} mt-1.5 inline-block`}>
              Open in Google Maps
            </a>
          )}
          <SocialLinks className="mt-4" />
        </div>
      </div>

      <div className="border-t border-asphalt-soft">
        <div className={`mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 ${stickyBar ? 'pb-28' : 'pb-5'} text-[0.95rem] text-wash/70 md:pb-5`}>
          <p>
            &copy; {new Date().getFullYear()} {business.name}
          </p>
          {site.credit && (
            <a href={site.credit.href} target="_blank" rel="noopener" className={link}>
              {site.credit.text}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
