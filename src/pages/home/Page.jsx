import './home.css'
import BookBand from '../../components/BookBand.jsx'
import Dinesh from './Dinesh.jsx'
import Fleet from './Fleet.jsx'
import Hero from './Hero.jsx'
import How from './How.jsx'
import Services from './Services.jsx'
import Tours from './Tours.jsx'
import Why from './Why.jsx'
import Reviews from './reviews/Reviews.jsx'

// Backgrounds alternate down the page, so no two neighbours match:
// yellow (hero) > light > white > yellow (owner) > dark > light > dark > yellow (book).
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Fleet />
      <Dinesh />
      <Why />
      <How /> =
      <Tours />
      <Reviews />
      <BookBand />
    </>
  )
}
