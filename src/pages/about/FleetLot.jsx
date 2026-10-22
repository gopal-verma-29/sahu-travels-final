import { useRef } from 'react'
import { about } from '../../content.js'
import { useInView } from '../../lib/useInView.js'
import Vehicle from '../../components/Vehicle.jsx'
import { h2 } from '../../components/ui.js'

// Width of each silhouette as a share of the widest one (the tempo), taken from the viewBoxes in
// Vehicle.jsx. Keeps the shared scale, so a Traveller still looks bigger than a car in any bay.
const SCALE = { hatchback: 65, sedan: 72, suv: 77, tempo: 100 }

// A parking lot seen from the road: one painted bay per vehicle type, and a dashed bay for the
// vehicle that has not arrived yet. When the lot scrolls into view the vehicles roll into their bays.
export default function FleetLot() {
  const { title, intro, types, next } = about.fleet
  const lot = useRef(null)
  const seen = useInView(lot, { threshold: 0.25 })

  return (
    <section id="fleet" className="scroll-mt-4 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>{title}</h2>
        <p className="mt-4 max-w-[58ch] text-lg">{intro}</p>
        <a href="/vehicles" className="mt-4 inline-block font-display text-[1.5rem] leading-none underline decoration-2 underline-offset-[6px]">
          See every vehicle with photos
        </a>

        <ul
          ref={lot}
          className={`ab-lot mt-10 grid grid-cols-2 border-t-[3px] border-l-[3px] border-wash/60 bg-asphalt text-wash lg:grid-cols-3 ${
            seen ? 'is-in' : ''
          }`}
        >
          {types.map((t, i) => (
            <li key={t.name} className="ab-bay flex flex-col justify-end border-r-[3px] border-b-[3px] border-wash/60 px-3 pt-10 pb-4 md:px-6">
              <div className="ab-car" style={{ '--i': i }}>
                <div className="mx-auto" style={{ width: `${SCALE[t.kind] ?? 100}%` }}>
                  <Vehicle kind={t.kind} className="w-full" />
                </div>
              </div>
              <p className="mt-3 font-display text-[1.7rem] font-semibold leading-none md:text-[2rem]">
                {t.name}
                {t.count > 1 && <span className="ml-2 text-plate">×{t.count}</span>}
              </p>
            </li>
          ))}
          {next && (
            <li className="flex border-r-[3px] border-b-[3px] border-wash/60 p-3 md:p-4">
              <div className="flex w-full flex-col justify-center rounded-sm border-2 border-dashed border-plate/70 px-3 py-6 text-center">
                <p className="font-display text-[1.7rem] font-semibold leading-none text-plate md:text-[2rem]">{next.title}</p>
                <p className="mt-2 text-wash/80">{next.text}</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
