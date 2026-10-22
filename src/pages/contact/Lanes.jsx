import { useRef } from 'react'
import { useInView } from '../../lib/useInView.js'
import { contact } from './content.js'

// The four reasons to get in touch, as one group of radio buttons. The cards arrive one after another
// when the group scrolls into view. Choosing one raises a dark fill into it while the previous card's
// fill leaves upward, and its road stud lights: the same studs as the road on /about.
export default function Lanes({ laneId, onPick, onPointerUp }) {
  const group = useRef(null)
  const seen = useInView(group, { threshold: 0.2 })

  return (
    <fieldset>
      <legend className="sr-only">What do you need help with?</legend>
      <div ref={group} className={`ct-lanes grid gap-3 sm:grid-cols-2 lg:grid-cols-4${seen ? ' is-in' : ''}`}>
        {contact.lanes.map((l, i) => (
          <label key={l.id} className="ct-lane" style={{ '--i': i }} onPointerUp={onPointerUp}>
            <input
              type="radio"
              name="lane"
              value={l.id}
              checked={l.id === laneId}
              onChange={() => onPick(l.id)}
              className="sr-only"
            />
            <span className="ct-face block h-full rounded-md border-2 border-asphalt p-4 pt-3 md:p-5 md:pt-4">
              <span lang="hi" className="block font-display text-[2.2rem] font-semibold leading-none">
                {l.hindi}
              </span>
              <span className="mt-1.5 flex items-center gap-2 font-bold">
                <span className="ct-stud" aria-hidden="true" />
                {l.label}
              </span>
              <span className="mt-1 block text-[0.95rem] leading-snug opacity-80">{l.blurb}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
