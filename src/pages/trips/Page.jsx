import { tours } from '../../content.js'
import OpenInvite from './OpenInvite.jsx'
import QuoteFactors from './QuoteFactors.jsx'
import TripsHero from './TripsHero.jsx'
import TripsRoad from './TripsRoad.jsx'
import './trips.css'

// The /trips page: headline and milestones, the road with one stop per trip, why quotes depend on details,
// then the open invitation (which is also the page's closing call to action). The shell (header, footer,
// phone bar) comes from App.jsx.
//
// Nearest first. Sorting here means a corrected distance in content.js re-orders the road by itself.
// A stop whose km is missing or not a number goes last, rather than leaving the whole order undefined.
const dist = (t) => (Number.isFinite(t.km) ? t.km : Infinity)
const stops = [...tours].sort((a, b) => (dist(a) === dist(b) ? 0 : dist(a) < dist(b) ? -1 : 1))

export default function TripsPage() {
  return (
    <>
      <TripsHero stops={stops} />
      <TripsRoad stops={stops} />
      <QuoteFactors />
      <OpenInvite />
    </>
  )
}
