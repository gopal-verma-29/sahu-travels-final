import { useRef } from 'react'
import { ui } from './copy.js'
import { useActiveStop, useDrive } from './hooks.js'
import Odometer from './Odometer.jsx'
import TripStop from './TripStop.jsx'

// The trips as one road. Scrolling drives you away from Raipur: the road fills in behind you, the stones of the
// stops you have passed light up, and the trip meter rolls to the distance of the latest one. All of it is decoration
// for sighted users; the list underneath is an ordinary list with the distances in text.
export default function TripsRoad({ stops }) {
  const road = useRef(null)
  useDrive(road)
  const activeId = useActiveStop(stops.map((s) => s.slug))
  const here = stops.find((s) => s.slug === activeId)
  const reached = stops.findIndex((s) => s.slug === activeId)
  const maxKm = Math.max(0, ...stops.map((s) => s.km).filter(Number.isFinite))

  return (
    <section className="bg-asphalt text-wash [--focus:var(--color-plate)]">
      <h2 className="sr-only">{ui.roadHeading}</h2>
      <div ref={road} className="relative mx-auto max-w-6xl px-5 pt-8 pb-16 md:pb-24">
        {/* Trip meter: stays at the top of the screen while the road is on screen. */}
        <div aria-hidden="true" className="pointer-events-none sticky top-3 z-20 mb-14 h-0">
          <div className="inline-flex min-w-[11.5rem] items-center gap-2.5 rounded-md bg-plate py-1 pr-3.5 pl-1.5 text-asphalt shadow-[0_3px_0_rgba(0,0,0,0.45)]">
            <span className="rounded-sm bg-asphalt px-1.5 pt-1 text-plate">
              <Odometer value={here?.km ?? 0} digits={3} className="text-[2rem]" />
            </span>
            <span className="pt-1 font-display text-[1.5rem] leading-none font-semibold">
              km {here ? `to ${here.name}` : `in ${ui.start}`}
            </span>
          </div>
        </div>

        {/* The road itself: dashed centre line, solid where you have driven, a pin where you are. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-5 md:left-5">
          <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[repeating-linear-gradient(180deg,var(--color-plate)_0_12px,transparent_12px_24px)] opacity-40" />
          <div className="road-fill absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-plate" />
          <span className="road-pin absolute left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-asphalt bg-plate shadow-[0_0_0_4px_rgba(246,192,0,0.3)]" />
        </div>

        <ol className="space-y-14 md:space-y-20 md:pl-14">
          {stops.map((t, i) => (
            <TripStop key={t.slug} trip={t} passed={i <= reached} maxKm={maxKm} />
          ))}
        </ol>
      </div>
    </section>
  )
}
