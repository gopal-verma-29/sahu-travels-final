import { useRef } from 'react'
import { askAbout, contactLink } from '../../lib/links.js'
import { useInView } from '../../lib/useInView.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon } from '../../components/Icons.jsx'
import { h2 } from '../../components/ui.js'
import Vehicle from '../../components/Vehicle.jsx'
import Gallery from './Gallery.jsx'

// Seat count as a roadside milestone: the same stone as the favicon.
function Stone({ big, small }) {
  return (
    <div aria-hidden="true" className="flex min-w-[5.25rem] shrink-0 flex-col overflow-hidden rounded-t-[2.75rem] border-2 border-asphalt text-center">
      <span className="bg-plate px-3 pt-4 pb-0.5 font-display text-[2.6rem] font-semibold leading-none">{big}</span>
      <span className="bg-asphalt px-2 pt-1 pb-0.5 font-display text-[1.15rem] leading-none text-wash">{small}</span>
    </div>
  )
}

// Shown while a vehicle has no photos yet: the site's own silhouette and a way to ask for some.
function NoPhoto({ v }) {
  return (
    <div className="flex aspect-video flex-col items-center justify-end gap-3 border-2 border-asphalt bg-asphalt px-6 pt-6 pb-5 text-center">
      <Vehicle kind={v.kind} className="w-[70%]" />
      <a
        href={askAbout(`could you send photos of the ${v.name}?`)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-display text-[1.5rem] leading-none text-plate underline decoration-2 underline-offset-[6px] [--focus:var(--color-plate)]"
      >
        Photos on request: ask on WhatsApp
      </a>
    </div>
  )
}

export default function VehicleSection({ v, index }) {
  const ref = useRef(null)
  const seen = useInView(ref, { threshold: 0.15 })
  const flip = index % 2 === 1

  return (
    <section
      id={v.id}
      ref={ref}
      aria-labelledby={`${v.id}-name`}
      className={`vh-sec scroll-mt-4 ${flip ? 'vh-flip bg-wash' : 'bg-white'} ${seen ? 'is-in' : ''}`}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-2 md:gap-14 md:py-20">
        <div className={`vh-photo ${flip ? 'md:order-2' : ''}`}>
          {v.photos.length ? <Gallery photos={v.photos} name={v.name} /> : <NoPhoto v={v} />}
        </div>

        <div className="vh-text">
          <div className="flex items-end gap-4">
            <Stone big={v.badge[0]} small={v.badge[1]} />
            <div className="min-w-0">
              <h2 id={`${v.id}-name`} className={h2}>{v.name}</h2>
              <p className="mt-1 text-asphalt/70">{v.make}</p>
            </div>
          </div>

          <p className="mt-6 max-w-[48ch] text-lg">{v.text}</p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {v.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-3 w-3 border-2 border-asphalt bg-plate" />
                {f}
              </li>
            ))}
          </ul>

          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
            <dt className="font-bold">Seats</dt>
            <dd>{v.seats}</dd>
            <dt className="font-bold">Good for</dt>
            <dd>{v.goodFor}</dd>
          </dl>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton stack variant="ink" href={contactLink({ lane: 'trip', vehicle: v.name })}>
              Enquire
            </LinkButton>
            <LinkButton stack variant="line" href={askAbout(`I'd like the best price for ${v.want}.`)} icon={<ChatIcon />}>
              Get best price
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
