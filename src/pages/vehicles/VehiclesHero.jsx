import { vehicles } from '../../content.js'
import { askAbout, telLink } from '../../lib/links.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon, PhoneIcon } from '../../components/Icons.jsx'
import Vehicle from '../../components/Vehicle.jsx'

// Silhouette width from Vehicle.jsx's shared scale, and how late each one pulls in.
const row = [['sedan', 72, 0.1], ['suv', 77, 0.5], ['tempo', 100, 0.9]]
const total = row.reduce((n, [, w]) => n + w, 0)

// Yellow opening like /about: the headline rises through a mask, then three vehicles pull in
// and park on the asphalt. One sequence, then the page is still.
export default function VehiclesHero() {
  return (
    <section id="top" className="bg-plate text-asphalt">
      <div className="mx-auto max-w-6xl px-5 pt-8 pb-12 md:pt-14 md:pb-16">
        <h1 className="vh-title font-display font-semibold leading-[1.02] tracking-tight">
          <span lang="hi" className="block">
            {vehicles.headline.map((line, i) => (
              <span key={line} className="vh-mask block">
                <span className="vh-rise block" style={{ '--i': i }}>{line}</span>
              </span>
            ))}
          </span>
          <span className="sr-only">{vehicles.srHeading}</span>
        </h1>
        <p className="vh-fade mt-6 max-w-[40ch] text-xl leading-snug md:text-[1.6rem]">{vehicles.lead}</p>
        <div className="vh-fade mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <LinkButton stack variant="ink" href={askAbout(vehicles.cta.ask)} icon={<ChatIcon />}>
            Get best price on WhatsApp
          </LinkButton>
          <LinkButton stack variant="line" href={telLink} icon={<PhoneIcon />}>
            Call now
          </LinkButton>
        </div>
      </div>

      <div aria-hidden="true" className="overflow-hidden bg-asphalt">
        <div className="mx-auto flex max-w-6xl items-end gap-[4%] px-5 pt-8">
          {row.map(([kind, w, delay]) => (
            <div key={kind} style={{ width: `${(w / total) * 92}%` }}>
              <div className="drive-in" style={{ animationDelay: `${delay}s` }}>
                <Vehicle kind={kind} className="w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="relative h-10">
          <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--color-plate)_0_44px,transparent_44px_88px)]" />
        </div>
      </div>
    </section>
  )
}
