import { useRef } from 'react'
import { vehicles } from '../../content.js'
import { askAbout } from '../../lib/links.js'
import { useInView } from '../../lib/useInView.js'
import { LinkButton } from '../../components/Button.jsx'
import { ChatIcon } from '../../components/Icons.jsx'
import Vehicle from '../../components/Vehicle.jsx'
import { h2 } from '../../components/ui.js'
import { fleetSection } from './content.js'

const dir = '/images/vehicles/'

// One painted bay per vehicle, like the /about fleet lot: the photo rolls in from the left and
// parks, then the seat plate lands on its bumper. The whole card is one link to that vehicle's
// section on /vehicles. A vehicle with no photos yet shows the site's silhouette in its bay.
function Bay({ v, i }) {
  const ref = useRef(null)
  const seen = useInView(ref, { threshold: 0.3 })
  const photo = v.photos[0]
  const [big, small] = v.badge

  return (
    <li ref={ref} style={{ '--i': i % 3 }} className={`hm-card relative flex flex-col ${seen ? 'is-in' : ''}`}>
      <div className="relative">
        <div className="hm-bay aspect-video border-2 border-asphalt bg-asphalt">
          {photo ? (
            <img
              src={`${dir}${photo.n}-${photo.maxW ?? 1000}.webp`}
              srcSet={
                photo.maxW === 560
                  ? `${dir}${photo.n}-160.webp 160w, ${dir}${photo.n}-560.webp 560w`
                  : `${dir}${photo.n}-560.webp 560w, ${dir}${photo.n}-1000.webp 1000w`
              }
              sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
              width={photo.maxW ?? 1000}
              height="563"
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="hm-car block h-full w-full object-cover"
            />
          ) : (
            <div className="hm-car flex h-full items-end justify-center pb-5">
              <Vehicle kind={v.kind} className="w-[62%]" />
            </div>
          )}
        </div>
        <span
          aria-hidden="true"
          className="hm-plate absolute -bottom-3.5 left-3 rounded-md border-[3px] border-asphalt bg-plate px-3 pt-1.5 pb-0.5 font-display text-[1.6rem] font-semibold leading-none"
        >
          {big} {small}
        </span>
      </div>

      <h3 className="mt-8 font-display text-[2.2rem] font-semibold leading-none">
        <a href={`/vehicles#${v.id}`} className="after:absolute after:inset-0">
          {v.name}
          <span className="sr-only">, {v.seatLabel}. Photos and details</span>
        </a>
      </h3>
      <p className="mt-1 text-asphalt/70">{v.make}</p>
      <p className="mt-2 max-w-[40ch] text-pretty">{v.goodFor}</p>
      <p
        aria-hidden="true"
        className="mt-3 font-display text-[1.5rem] leading-none underline decoration-2 underline-offset-[6px]"
      >
        {photo ? 'Photos and details' : 'Details'}
      </p>
    </li>
  )
}

export default function Fleet() {
  return (
    <section id="fleet" className="scroll-mt-4 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>{fleetSection.title}</h2>
        <p className="mt-4 max-w-[56ch] text-lg">{fleetSection.intro}</p>

        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.items.map((v, i) => (
            <Bay key={v.id} v={v} i={i} />
          ))}
          <li className="flex flex-col justify-center gap-5 bg-asphalt p-6 text-wash [--focus:var(--color-plate)] md:p-8 lg:col-span-2">
            <h3 className="font-display text-[2.4rem] font-semibold leading-none text-plate">{vehicles.cta.title}</h3>
            <p className="max-w-[44ch] text-lg text-wash/80">{vehicles.cta.text}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton stack variant="wa" href={askAbout(vehicles.cta.ask)} icon={<ChatIcon />}>
                Get best price on WhatsApp
              </LinkButton>
              <LinkButton stack variant="lineLight" href="/vehicles">
                See all vehicles
              </LinkButton>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}
