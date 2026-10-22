import { useRef } from 'react'
import { services } from '../../content.js'
import { useInView } from '../../lib/useInView.js'
import { h2 } from '../../components/ui.js'
import { servicesSection } from './content.js'
import { ServiceIcon } from './icons.jsx'

// Each service is a roadside sign on a milestone arch (the shape of the favicon and the trip
// stones). The arches are planted as the grid scrolls into view.
export default function Services() {
  const grid = useRef(null)
  const seen = useInView(grid, { threshold: 0.2 })

  return (
    <section id="services" className="scroll-mt-4">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className={h2}>{servicesSection.title}</h2>
        <ul ref={grid} className={`hm-sv-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${seen ? 'is-in' : ''}`}>
          {services.map((s, i) => (
            <li key={s.name} className="flex gap-4 border-2 border-asphalt bg-white p-4 md:gap-5 md:p-5">
              <span
                aria-hidden="true"
                style={{ '--i': i }}
                className="hm-arch flex h-[4.75rem] w-14 shrink-0 items-end justify-center rounded-t-full border-2 border-asphalt bg-plate pb-3.5 md:h-20 md:w-16"
              >
                <ServiceIcon name={s.name} />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[1.9rem] font-semibold leading-[1.05]">{s.name}</h3>
                <p className="mt-1.5 text-pretty">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
