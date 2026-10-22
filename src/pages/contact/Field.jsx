import { input, label } from '../../components/ui.js'
import { FIELDS } from './message.js'

const today = new Date().toLocaleDateString('en-CA')

// One question of the form. `index` is its place in the lane's list: the questions appear one after
// another (see .ct-field in contact.css), including each time the visitor switches lane.
export default function Field({ id, index, lane, value, onChange, invalid, span, extraOption }) {
  const f = FIELDS[id]
  const text = lane.labels?.[id] ?? f.label
  const fid = `f-${id}`
  const wrap = `ct-field${span ? ' md:col-span-2' : ''}`
  const place = { '--i': index }
  const common = { id: fid, name: id, value, onChange }
  // A required question that was left empty says so, to screen readers as well as on screen.
  const flag = {
    'aria-invalid': invalid || undefined,
    'aria-describedby': invalid ? `${fid}-error` : undefined,
  }

  if (f.type === 'choice') {
    return (
      <fieldset className={wrap} style={place}>
        <legend className={label}>{text}</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {f.options.map((o) => (
            <label key={o}>
              <input type="radio" name={id} value={o} checked={value === o} onChange={onChange} className="peer sr-only" />
              <span className="flex min-h-[52px] items-center justify-center rounded-md border-2 border-asphalt bg-white pt-1 font-display text-[1.4rem] font-semibold leading-none transition-colors duration-200 peer-checked:bg-asphalt peer-checked:text-plate peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-asphalt motion-reduce:transition-none">
                {o}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    )
  }

  let control
  if (f.type === 'select') {
    control = (
      <select {...common} {...flag} className={input}>
        {(extraOption ? [...f.options, extraOption] : f.options).map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    )
  } else if (f.type === 'textarea') {
    control = <textarea {...common} {...flag} rows="3" className={`${input} py-3`} />
  } else if (f.type === 'number') {
    control = <input {...common} {...flag} type="number" min={f.min} max={f.max} inputMode="numeric" placeholder={f.placeholder} className={input} />
  } else if (f.type === 'date') {
    control = <input {...common} {...flag} type="date" min={today} className={input} />
  } else {
    control = (
      <input {...common} {...flag} list={f.list} autoComplete={f.autoComplete ?? 'off'} placeholder={f.placeholder} className={input} />
    )
  }

  return (
    <div className={wrap} style={place}>
      <label htmlFor={fid} className={label}>
        {text}
      </label>
      {control}
      {invalid && (
        <p id={`${fid}-error`} role="alert" className="ct-error mt-1.5 font-bold text-tail">
          {f.missing}
        </p>
      )}
    </div>
  )
}
