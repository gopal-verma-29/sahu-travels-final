// A roadside milestone: distance on the painted cap, place on the whitewashed body. The same shape as the
// home page's Stone, but sized by whatever holds it (the place name scales with the stone's own width, so
// "Barnawapara" fits a 64px stone on a 320px phone without wrapping). `ink` flips the cap to dark for use on yellow.
export default function Marker({ name, km, ink = false }) {
  const isNumber = typeof km === 'number'
  return (
    <span className="flex w-full flex-col-reverse text-center text-asphalt [container-type:inline-size]">
      <span className="bg-wash px-0.5 pt-2 pb-2.5 font-display text-[clamp(0.7rem,19cqw,1.2rem)] leading-none font-semibold [overflow-wrap:anywhere] md:text-[clamp(0.85rem,19cqw,1.45rem)]">
        {name}
      </span>
      <span
        className={`flex min-h-[4.5rem] flex-col items-center rounded-t-full px-1 pt-4 pb-1.5 font-display leading-none md:min-h-[5.75rem] md:pt-6 md:pb-2 ${
          ink ? 'bg-asphalt text-plate' : 'bg-plate'
        }`}
      >
        <span className="block text-[clamp(1.9rem,8vw,2.6rem)] leading-[0.8] font-semibold md:text-[2.9rem]">{km}</span>
        {isNumber && (
          <>
            <span className="mt-1 block text-[clamp(0.85rem,3.4vw,1.1rem)] leading-none">km</span>
            <span className="sr-only"> from Raipur by road</span>
          </>
        )}
      </span>
    </span>
  )
}
