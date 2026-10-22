import { business } from '../../content.js'
import { contact } from './content.js'
import { laneRows } from './message.js'

// Shows the WhatsApp message as it will arrive, and builds it line by line while the visitor fills in
// the form. It uses laneRows() from message.js, the same function that writes the real message, so the
// preview cannot say something the message does not. Wide screens only (there the left column is
// otherwise empty); on phones the form is the first thing under the lane cards and stays that way.
// Decorative echo of the inputs, so it is hidden from screen readers.
export default function MessagePreview({ lane, values }) {
  const rows = laneRows(lane, values)

  return (
    <figure aria-hidden="true" className="mt-10 hidden lg:block">
      <figcaption className="text-[0.95rem] font-bold">{contact.previewLabel}</figcaption>
      <div key={lane.id} className="ct-bubble mt-2 max-w-[22rem] text-[0.98rem] leading-snug">
        <p>{`Hi ${business.name}, ${lane.opening}`}</p>
        {rows.length > 0 && (
          <div className="mt-2.5 space-y-0.5">
            {rows.map((row) => (
              <p key={row.id} className="ct-line">{`${row.key}: ${row.value}`}</p>
            ))}
          </div>
        )}
      </div>
    </figure>
  )
}
