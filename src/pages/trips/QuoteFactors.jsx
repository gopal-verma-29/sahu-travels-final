import { tripsPage } from '../../content.js'
import { h2 } from '../../components/ui.js'
import { Icon } from './icons.jsx'

const ICONS = ['pin', 'users', 'repeat', 'calendar']

// Why there is no price list, and what to send instead. Copy comes from tripsPage in content.js.
export default function QuoteFactors() {
  return (
    <section className="bg-wash text-asphalt">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <h2 className={h2}>{tripsPage.quoteHeading}</h2>
          <p className="mt-4 max-w-[44ch] text-lg">{tripsPage.quoteLead}</p>
        </div>
        <ul className="grid gap-[2px] overflow-hidden rounded-md border-2 border-asphalt bg-asphalt sm:grid-cols-2">
          {tripsPage.quoteFactors.map((factor, i) => (
            // The card is its own container: icon beside the text while there is room for both, icon above when a
            // large text size (or a very small screen) leaves the text a sliver. Measured in rem, so it follows the text size.
            <li key={factor.name} className="@container bg-white p-5 md:p-6">
              <div className="flex flex-col gap-3 @min-[15rem]:flex-row @min-[15rem]:gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-plate">
                  <Icon name={ICONS[i % ICONS.length]} />
                </span>
                <div className="min-w-0">
                  <h3 className="pt-1 font-display text-[1.7rem] leading-none font-semibold">{factor.name}</h3>
                  <p className="mt-1.5">{factor.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
