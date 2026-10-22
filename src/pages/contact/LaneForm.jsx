import { useRef } from 'react'
import { business, tours } from '../../content.js'
import { LinkButton, btn } from '../../components/Button.jsx'
import { ChatIcon, PhoneIcon } from '../../components/Icons.jsx'
import { h2 } from '../../components/ui.js'
import { telLink } from '../../lib/links.js'
import { useInView } from '../../lib/useInView.js'
import Field from './Field.jsx'
import MessagePreview from './MessagePreview.jsx'
import { FIELDS } from './message.js'

// Two columns from md up. A question that would sit alone on a row stretches across it.
function layout(ids) {
  const out = []
  let col = 0
  for (const id of ids) {
    if (FIELDS[id].wide) {
      if (col === 1) out[out.length - 1].span = true
      out.push({ id, span: true })
      col = 0
    } else {
      out.push({ id, span: false })
      col ^= 1
    }
  }
  if (col === 1) out[out.length - 1].span = true
  return out
}

// What the chosen lane is, next to the form that belongs to it. Switching lane re-keys the heading,
// the blurb, the preview and every question, so they appear fresh one after another. The form card
// gets the hard shadow of the photo on /about, which slides out from behind it the first time the
// card is on screen.
export default function LaneForm({ lane, values, invalid, sentUrl, extraVehicle, formTop, change, onSubmit }) {
  const card = useRef(null)
  const seen = useInView(card, { threshold: 0.12 })

  return (
    <div ref={formTop} className="mt-12 grid scroll-mt-4 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <div aria-live="polite">
          <h2 className={h2}>
            <span key={lane.id} className="ct-swap block">
              {lane.label}
            </span>
          </h2>
        </div>
        <div key={lane.id} className="ct-swap" style={{ '--i': 1 }}>
          <p className="mt-4 max-w-[40ch] text-lg text-pretty">{lane.blurb}</p>
        </div>
        <p className="mt-3 max-w-[40ch] text-lg text-pretty">You can change anything in WhatsApp before you send it.</p>
        <MessagePreview lane={lane} values={values} />
      </div>

      <div ref={card} className={`ct-card relative${seen ? ' is-in' : ''}`}>
        <div aria-hidden="true" className="ct-card-shadow absolute inset-0 rounded-md bg-asphalt" />
        <form onSubmit={onSubmit} noValidate className="ct-form relative rounded-md border-2 border-asphalt bg-wash p-5 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            {layout(lane.fields).map(({ id, span }, i) => (
              <Field
                key={`${lane.id}-${id}`}
                id={id}
                index={i}
                lane={lane}
                span={span}
                value={values[id]}
                onChange={change(id)}
                invalid={invalid === id}
                extraOption={id === 'vehicle' ? extraVehicle : ''}
              />
            ))}
          </div>
          <datalist id="places">
            {tours.map((t) => (
              <option key={t.name} value={t.name} />
            ))}
          </datalist>

          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" className={`${btn({ variant: 'ink' })} ct-press`}>
              <ChatIcon />
              Send on WhatsApp
            </button>
            <LinkButton variant="line" href={telLink} icon={<PhoneIcon />}>
              Call instead
            </LinkButton>
          </div>

          {sentUrl && (
            <p key={sentUrl} role="status" className="ct-sent mt-5 rounded-md border-2 border-asphalt bg-white p-4">
              WhatsApp should open with your details. If it did not,{' '}
              <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">
                open WhatsApp here
              </a>{' '}
              or call {business.phoneDisplay}.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
