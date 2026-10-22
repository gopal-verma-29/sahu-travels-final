import { useRef } from 'react'
import { anywhere, tripsPage } from '../../content.js'
import { useInView } from '../../lib/useInView.js'
import { ui } from './copy.js'
import Marker from './Marker.jsx'

// Yellow headline, then the road out of Raipur: every trip as a milestone, nearest first, each a link to its
// stop below. The stones rise out of the ground once, when the row first comes into view. The one moment on
// this page that moves by itself.
export default function TripsHero({ stops }) {
  const row = useRef(null)
  const rise = useInView(row, { threshold: 0.35 })
  const items = [...stops.map((t) => ({ id: t.slug, name: t.name, km: t.km })), { id: 'enquire', name: anywhere.name, km: anywhere.km }]
  return (
    <>
      <section className="bg-plate text-asphalt">
        <div className="mx-auto max-w-6xl px-5 pt-8 pb-12 md:pt-14 md:pb-16">
          <h1 className="font-display text-[clamp(4.25rem,20vw,12rem)] leading-[0.92] font-semibold tracking-tight text-balance">
            {tripsPage.h1}
          </h1>
          <p className="mt-6 max-w-[34ch] text-xl leading-snug md:text-[1.6rem]">{tripsPage.lead}</p>
        </div>
      </section>

      <section className="bg-asphalt text-wash [--focus:var(--color-plate)]">
        <nav aria-label={ui.stonesLabel} className="mx-auto max-w-6xl px-5 pt-10 pb-12 md:pt-14">
          <ol
            ref={row}
            data-rise={rise || undefined}
            className="stones grid grid-cols-4 gap-x-2 gap-y-9 md:grid-cols-8 md:gap-x-3"
          >
            {items.map((item, i) => (
              <li
                key={item.id}
                style={{ '--i': i }}
                className="relative pb-[10px] after:pointer-events-none after:absolute after:inset-x-[-4px] after:bottom-[7px] after:h-[3px] after:bg-[repeating-linear-gradient(90deg,var(--color-plate)_0_10px,transparent_10px_20px)]"
              >
                <a href={`#${item.id}`} className="block">
                  <span className="stone-body block">
                    <Marker name={item.name} km={item.km} />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>
    </>
  )
}
