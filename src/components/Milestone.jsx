// A roadside milestone: distance on the painted cap, place on the whitewashed body.
// DOM order is name first (reads naturally); flex-col-reverse puts the cap on top.
export default function Stone({ name, km }) {
  return (
    <div className="flex w-32 shrink-0 flex-col-reverse text-center text-asphalt">
      <h3 className="bg-wash px-1.5 pt-2.5 pb-3 font-display text-[1.5rem] font-semibold leading-none">{name}</h3>
      <p className="min-h-[5.75rem] rounded-t-full bg-plate px-2 pt-6 pb-2 font-display leading-none">
        <span className="block text-[2.9rem] font-semibold leading-[0.8]">{km}</span>
        {typeof km === 'number' && (
          <>
            <span className="mt-1 block text-lg leading-none">km</span>
            <span className="sr-only"> from Raipur by road</span>
          </>
        )}
      </p>
    </div>
  )
}
