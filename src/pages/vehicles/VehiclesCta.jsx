import { vehicles } from '../../content.js'
import { askAbout, contactLink, telLink } from '../../lib/links.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon, PhoneIcon } from '../../components/Icons.jsx'
import { h2 } from '../../components/ui.js'

// Closes the page like /about: yellow, two actions, the painted centre line running into the footer.
export default function VehiclesCta() {
  const { title, text, ask } = vehicles.cta
  return (
    <section id="plan" className="bg-plate text-asphalt">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-14 md:pt-24 md:pb-20">
        <h2 className={h2}>{title}</h2>
        <p className="mt-4 max-w-[40ch] text-xl leading-snug md:text-[1.6rem]">{text}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton stack variant="ink" href={askAbout(ask)} icon={<ChatIcon />}>
            Get best price on WhatsApp
          </LinkButton>
          <LinkButton stack variant="line" href={telLink} icon={<PhoneIcon />}>
            Call now
          </LinkButton>
        </div>
        <p className="mt-6 text-lg">
          Prefer a form?{' '}
          <a href={contactLink({ lane: 'trip' })} className="font-bold underline decoration-2 underline-offset-4">
            Fill in the trip details
          </a>
        </p>
      </div>
      <div aria-hidden="true" className="relative h-12 bg-asphalt">
        <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--color-plate)_0_44px,transparent_44px_88px)]" />
      </div>
    </section>
  )
}
