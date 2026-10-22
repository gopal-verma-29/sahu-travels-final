const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// A taxi-dashboard odometer. Decorative (aria-hidden): whatever shows it also states the distance in text.
// Set the font size from outside; every measure here is in em. Leading zeros are dimmed, like the real thing.
export default function Odometer({ value, digits = 3, className = '' }) {
  const whole = Math.max(0, Math.round(value))
  const text = String(whole).padStart(digits, '0').slice(-digits)
  const blanks = Math.max(0, digits - String(whole).length)
  return (
    <span aria-hidden="true" className={`odo-wheels font-display font-semibold ${className}`}>
      {[...text].map((d, i) => (
        <span key={i} className={`odo-wheel${i < blanks ? ' odo-dim' : ''}`}>
          <span
            className="odo-strip"
            style={{ transform: `translateY(${-Number(d)}em)`, transitionDelay: `${(digits - 1 - i) * 70}ms` }}
          >
            {DIGITS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}
