const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Years start rolling from the start of their decade (1998 ticks up from 1990); small counts
// start from 0. Pass `from` to start somewhere else, e.g. 6 -> 7.
const startOf = (value) => (value >= 100 ? Math.floor(value / 10) * 10 : 0)

// A taxi-meter style digit counter. Decorative: the milestone's heading says the same thing
// in words, so the whole thing is hidden from screen readers.
export default function Odometer({ value, from }) {
  const end = String(value)
  const start = String(from ?? startOf(value)).padStart(end.length, '0')
  return (
    <span className="ab-odo" aria-hidden="true">
      {[...end].map((digit, i) => (
        <span key={i} className="ab-odo-win">
          <span className="ab-odo-reel" style={{ '--to': digit, '--from': start[i], '--n': end.length - 1 - i }}>
            {DIGITS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}
