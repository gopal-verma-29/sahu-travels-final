import { useRef } from 'react'
import { anywhere, tours } from '../../content.js'
import { askAbout, contactLink } from '../../lib/links.js'
import { useInView } from '../../lib/useInView.js'
import { LinkButton } from '../../components/Button.jsx'
import Stone from '../../components/Milestone.jsx'
import { h2 } from '../../components/ui.js'
import { homeTours } from './content.js'

// Phones: stone beside the details. Wider screens: stone above, button pinned to the bottom
// so the buttons line up across a row. The stones are planted as the row scrolls into view,
// the same way they are on /about.
function Trip({ name, km, trip, note, action, i }) {
  return (
    <li style={{ '--i': i }} className="flex gap-5 max-[359px]:flex-col sm:flex-col sm:gap-6">
      <div className="hm-stone shrink-0">
        <Stone name={name} km={km} />
      </div>
      <div className="hm-stone-text flex flex-col items-start gap-3 sm:flex-1">
        <p className="font-display text-2xl font-semibold leading-none text-plate">{trip}</p>
        <p className="text-wash/80">{note}</p>
        <div className="mt-auto pt-1">{action}</div>
      </div>
    </li>
  )
}

// Four trips here; /trips has all of them, so that page still has something to show.
export default function Tours() {
  const row = useRef(null)
  const seen = useInView(row, { threshold: 0.15 })

  return (
    <section id="tours" className="scroll-mt-4 bg-asphalt text-wash [--focus:var(--color-plate)]">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>Popular trips from Raipur</h2>
        <p className="mt-4 max-w-[58ch] text-lg text-wash/80">
          Distances are approximate road kilometres from Raipur. Tell us your dates and we will quote
          the best price for the route you want.
        </p>

        <ul ref={row} className={`hm-trips mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-3 lg:grid-cols-5 ${seen ? 'is-in' : ''}`}>
          {homeTours.map((t, i) => (
            <Trip
              key={t.name}
              {...t}
              i={i}
              action={
                <LinkButton
                  variant="lineLight"
                  size="sm"
                  href={askAbout(`I'd like the best price for a cab from Raipur to ${t.name}.`)}
                >
                  Enquire now
                </LinkButton>
              }
            />
          ))}
          <Trip
            {...anywhere}
            i={homeTours.length}
            action={
              <LinkButton variant="plate" size="sm" href={contactLink({ lane: 'trip' })}>
                Plan my trip
              </LinkButton>
            }
          />
        </ul>
        <div className="mt-12 flex justify-center">
          <LinkButton variant="plate" href="/trips">Explore all {tours.length} trips from Raipur</LinkButton>
        </div>
      </div>
    </section>
  )
}
