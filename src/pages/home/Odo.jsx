const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Years start rolling from the start of their decade (1998 ticks up from 1990); small counts
// start from 0. The same taxi-meter counter as the /about road, driven here by the owner band
// scrolling into view. Decorative: the stone's screen-reader text says the same in words.
const startOf = (value) => (value >= 100 ? Math.floor(value / 10) * 10 : 0)

export default function Odo({ value, from }) {
  const end = String(value)
  const start = String(from ?? startOf(value)).padStart(end.length, '0')
  return (
    <span className="hm-odo" aria-hidden="true">
      {[...end].map((digit, i) => (
        <span key={i} className="hm-odo-win">
          <span className="hm-odo-reel" style={{ '--to': digit, '--from': start[i], '--n': end.length - 1 - i }}>
            {DIGITS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}
