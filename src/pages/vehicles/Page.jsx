import './vehicles.css'
import { vehicles } from '../../content.js'
import Finder from './Finder.jsx'
import VehicleSection from './VehicleSection.jsx'
import VehiclesCta from './VehiclesCta.jsx'
import VehiclesHero from './VehiclesHero.jsx'

export default function VehiclesPage() {
  return (
    <>
      <VehiclesHero />
      <Finder />
      {vehicles.items.map((v, i) => (
        <VehicleSection key={v.id} v={v} index={i} />
      ))}
      <VehiclesCta />
    </>
  )
}
