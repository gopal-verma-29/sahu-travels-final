import { useRef } from 'react'
import { about } from '../../content.js'
import { h2 } from '../../components/ui.js'
import Odometer from './Odometer.jsx'
import { useRoadProgress } from './useRoadProgress.js'

// The brand's milestone mark (same shape as the favicon), outlined so it reads on the road.
function RoadMarker() {
  return (
    <svg viewBox="0 0 32 32" className="ab-marker" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="30" height="30" rx="6" fill="#24272C" stroke="#F6C000" strokeWidth="2" />
      <path d="M9 26V15a7 7 0 0 1 14 0v11z" fill="#F6C000" />
      <rect x="9" y="19" width="14" height="7" fill="#F2F4F1" />
    </svg>
  )
}

// A roadside milestone, like the trip stones on the homepage: painted cap, whitewashed body.
// A planned milestone is drawn dashed: it is on the way, not on the road yet.
function Stone({ value, from, unit, label, planned }) {
  return (
    <div className="ab-stone flex w-28 shrink-0 flex-col text-center md:w-32" aria-hidden="true">
      <p
        className={`min-h-[5.75rem] rounded-t-full px-2 pt-6 pb-2 font-display leading-none ${
          planned ? 'border-2 border-b-0 border-dashed border-plate text-plate' : 'bg-plate text-asphalt'
        }`}
      >
        <span className="block text-[2.9rem] font-semibold leading-[0.8]">
          <Odometer value={value} from={from} />
        </span>
        {unit && <span className="mt-1 block text-lg leading-none">{unit}</span>}
      </p>
      <p
        className={`px-1.5 pt-2.5 pb-3 font-display text-[1.5rem] font-semibold leading-none ${
          planned ? 'border-2 border-dashed border-wash/50 text-wash' : 'bg-wash text-asphalt'
        }`}
      >
        {label}
      </p>
    </div>
  )
}

export default function Journey() {
  const track = useRef(null)
  useRoadProgress(track)

  return (
    <section id="story" className="scroll-mt-4 bg-asphalt text-wash [--focus:var(--color-plate)]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>{about.journey.title}</h2>
        <p className="mt-4 max-w-[58ch] text-lg text-wash/80">{about.journey.intro}</p>

        <div ref={track} className="ab-journey mt-14 md:mt-16">
          <div className="ab-road" aria-hidden="true" />
          <RoadMarker />
          <ol className="relative flex flex-col gap-14 md:gap-20">
            {about.milestones.map((m, i) => {
              const stoneLeft = i % 2 === 0
              return (
                <li
                  key={m.title}
                  data-milestone
                  className={`ab-ms relative grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-x-5 md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] md:gap-x-0 ${
                    m.planned ? 'is-planned' : ''
                  }`}
                >
                  <span className="ab-stud" data-stud aria-hidden="true" />
                  <div
                    className={`md:row-start-1 ${
                      stoneLeft ? 'md:col-start-1 md:justify-self-end md:pr-10' : 'md:col-start-3 md:justify-self-start md:pl-10'
                    }`}
                  >
                    <Stone {...m} />
                  </div>
                  <div
                    className={`ab-ms-text md:row-start-1 ${
                      stoneLeft ? 'md:col-start-3 md:pl-10' : 'md:col-start-1 md:pr-10 md:text-right'
                    }`}
                  >
                    <h3 className="font-display text-[2rem] font-semibold leading-none md:text-[2.4rem]">
                      <span className="sr-only">{m.when}. </span>
                      {m.title}
                    </h3>
                    <p className={`mt-2 max-w-[30ch] text-lg text-wash/80 ${stoneLeft ? '' : 'md:ml-auto'}`}>{m.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
