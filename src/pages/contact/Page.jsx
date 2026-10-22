import { useRef, useState } from 'react'
import { fleet, vehicles } from '../../content.js'
import { waLink } from '../../lib/links.js'
import { replaceSearch } from '../../router.js'
import './contact.css'
import ContactHero from './ContactHero.jsx'
import LaneForm from './LaneForm.jsx'
import Lanes from './Lanes.jsx'
import { contact } from './content.js'
import { buildLaneMessage, initialValues } from './message.js'

// /contact?lane=group opens that lane; ?to=Chitrakote and ?vehicle=suv prefill the form.
// Other pages, and the business's own WhatsApp replies, can link straight to the right start.
function readUrl() {
  const q = new URLSearchParams(window.location.search)
  const lane =
    contact.lanes.find((l) => l.id === q.get('lane')) ??
    contact.lanes.find((l) => l.id === contact.defaultLane) ??
    contact.lanes[0]
  const values = initialValues()
  const to = q.get('to')?.trim().slice(0, 80)
  if (to) values.going = to
  const want = q.get('vehicle')?.trim().toLowerCase()
  const car = fleet.find((f) => f.id === want || f.name.toLowerCase() === want)
  // A specific vehicle from /vehicles ("Innova Crysta") is not one of the four types in the list: add it.
  const named = car ? null : vehicles.items.find((v) => v.id === want || v.name.toLowerCase() === want)
  if (car) values.vehicle = car.name
  else if (named) values.vehicle = named.name
  return { laneId: lane.id, values, extraVehicle: named?.name ?? '' }
}

// The page: a yellow opening, the four lanes, and the form for the lane that is chosen. State lives
// here; the pieces (ContactHero, Lanes, LaneForm, Field, MessagePreview) only draw it. All motion is in
// contact.css and reads the same switch as /about and /vehicles (src/lib/motion.js).
export default function ContactPage() {
  const [start] = useState(readUrl)
  const [laneId, setLaneId] = useState(start.laneId)
  const [values, setValues] = useState(start.values)
  const [invalid, setInvalid] = useState('')
  const [sentUrl, setSentUrl] = useState('')
  const formTop = useRef(null)
  const lane = contact.lanes.find((l) => l.id === laneId)

  function pickLane(id) {
    setLaneId(id)
    setInvalid('')
    setSentUrl('')
    replaceSearch('lane', id) // a refresh or a shared link lands on the same lane
  }

  // On phones the form sits below the four cards and can be off screen after a tap. Bring it up.
  // Pointer only: someone arrowing through the cards with a keyboard should stay where they are.
  function showForm() {
    requestAnimationFrame(() => {
      const el = formTop.current
      if (!el || window.innerWidth >= 1024) return
      if (el.getBoundingClientRect().top < window.innerHeight * 0.6) return
      el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    })
  }

  const change = (id) => (e) => {
    setValues((v) => ({ ...v, [id]: e.target.value }))
    if (id === invalid) setInvalid('')
  }

  function onSubmit(e) {
    e.preventDefault()
    const empty = lane.required.find((id) => !values[id]?.trim())
    if (empty) {
      setInvalid(empty)
      document.getElementById(`f-${empty}`)?.focus()
      return
    }
    setInvalid('')
    const url = waLink(buildLaneMessage(lane, values))
    setSentUrl(url)
    // A noopener window always returns null, so there is nothing to check;
    // the note below the button is the fallback if the app does not open.
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <ContactHero />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
          <Lanes laneId={laneId} onPick={pickLane} onPointerUp={showForm} />
          <LaneForm
            lane={lane}
            values={values}
            invalid={invalid}
            sentUrl={sentUrl}
            extraVehicle={start.extraVehicle}
            formTop={formTop}
            change={change}
            onSubmit={onSubmit}
          />
        </div>
      </section>
    </>
  )
}
