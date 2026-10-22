import { useRef } from 'react'
import { useInView } from '../../lib/useInView.js'
import { h2 } from '../../components/ui.js'
import { how } from './content.js'

// Three steps along the road: the centre line is painted as the strip scrolls into view, and each
// stud lights as the line reaches it (the same studs as the /about road).
export default function How() {
  const strip = useRef(null)
  const seen = useInView(strip, { threshold: 0.35 })

  return (
    <section id="how" className="scroll-mt-4">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>{how.title}</h2>
        <div ref={strip} className={`hm-steps relative mt-12 ${seen ? 'is-in' : ''}`}>
          <div aria-hidden="true" className="hm-line" />
          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {how.steps.map((s, i) => (
              <li
                key={s.name}
                style={{ '--i': i }}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] content-start gap-x-5 md:grid-cols-1 md:gap-y-5"
              >
                <span
                  aria-hidden="true"
                  className="hm-stud grid h-14 w-14 place-items-center rounded-full border-[3px] border-asphalt bg-plate pt-1.5 font-display text-[2rem] font-semibold leading-none"
                >
                  {i + 1}
                </span>
                <div className="hm-step-text">
                  <h3 className="font-display text-[2.1rem] font-semibold leading-none">{s.name}</h3>
                  <p className="mt-2 max-w-[34ch] text-lg text-pretty">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
