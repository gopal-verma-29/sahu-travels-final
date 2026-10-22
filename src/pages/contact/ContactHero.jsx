import { Fragment } from 'react'
import { business } from '../../content.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon, PhoneIcon } from '../../components/Icons.jsx'
import Vehicle from '../../components/Vehicle.jsx'
import { askAbout, telLink } from '../../lib/links.js'
import { contact } from './content.js'

// The cab pulls in and parks once, like the homepage hero, a little smaller and a beat later so the
// headline gets the first look. Decorative, so it is hidden from screen readers.
function Road() {
  return (
    <div aria-hidden="true" className="relative h-[4.5rem] overflow-x-clip bg-asphalt md:h-24">
      <div className="absolute inset-x-0 bottom-4 h-[5px] bg-[repeating-linear-gradient(90deg,var(--color-plate)_0_44px,transparent_44px_88px)] md:bottom-5" />
      <Vehicle
        kind="sedan"
        sign
        className="drive-in absolute right-3 bottom-7 w-[10.5rem] md:right-[7%] md:bottom-9 md:w-[19rem]"
        style={{ animationDelay: '0.45s' }}
      />
    </div>
  )
}

// Same yellow opening as /about and the homepage. The headline rises word by word through a mask,
// the lead and the two buttons fade in behind it, and the cab parks last: one sequence, then still.
export default function ContactHero() {
  return (
    <section className="bg-plate text-asphalt">
      <div className="mx-auto max-w-6xl px-5 pt-6 pb-12 md:pt-10 md:pb-16">
        <h1 className="font-display text-[clamp(3.5rem,12vw,7.5rem)] font-semibold leading-[0.95] tracking-tight text-balance">
          {contact.heading.split(' ').map((word, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              <span className="ct-mask">
                <span className="ct-rise" style={{ '--i': i }}>
                  {word}
                </span>
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="ct-fade mt-5 max-w-[48ch] text-xl leading-snug md:text-[1.4rem]">{contact.lead}</p>
        <div className="ct-fade mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton stack variant="ink" href={askAbout(contact.quick)} icon={<ChatIcon />}>
            WhatsApp us
          </LinkButton>
          <LinkButton stack variant="line" href={telLink} icon={<PhoneIcon />}>
            Call {business.phoneDisplay}
          </LinkButton>
        </div>
      </div>
      <Road />
    </section>
  )
}
