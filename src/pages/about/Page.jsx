import './about.css'
import AboutCta from './AboutCta.jsx'
import AboutHero from './AboutHero.jsx'
import FleetLot from './FleetLot.jsx'
import Journey from './Journey.jsx'
import WhyUs from './WhyUs.jsx'

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Journey />
      <WhyUs />
      <FleetLot />
      <AboutCta />
    </>
  )
}
