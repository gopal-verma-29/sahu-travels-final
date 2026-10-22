// Generic side-view silhouettes (not any maker's design), drawn at one shared
// scale so a tempo traveller really looks bigger than a hatchback.
const INK = '#24272C'
const BODY = '#FFFFFF'
const RIM = '#D5DAD3'
const PLATE = '#F6C000'
const TAIL = '#C8372D'

// Walk the underside right to left, cutting a wheel arch over each wheel.
function underbody({ right, left, sill, wheels, R }) {
  let d = `L ${right} ${sill}`
  for (const { cx, cy } of [...wheels].sort((a, b) => b.cx - a.cx)) {
    const dx = Math.sqrt(R * R - (sill - cy) ** 2)
    d += ` L ${(cx + dx).toFixed(1)} ${sill} A ${R} ${R} 0 1 0 ${(cx - dx).toFixed(1)} ${sill}`
  }
  return `${d} L ${left} ${sill} Z`
}

const KINDS = {
  hatchback: {
    vb: [0, 0, 345, 140],
    sill: 122, left: 8, right: 342, R: 30,
    wheels: [{ cx: 72, cy: 111, r: 25 }, { cx: 280, cy: 111, r: 25 }],
    top: 'M 8 122 L 6 86 Q 6 70 18 64 L 58 14 Q 64 10 74 10 L 196 10 Q 208 10 216 18 L 250 52 L 262 56 L 312 62 Q 332 64 338 78 Q 342 88 342 102',
    glass: ['M40 50 L62 22 Q65 18 70 18 L118 18 L118 50 Z', 'M124 18 L192 18 Q200 18 205 23 L232 50 L124 50 Z'],
    seams: ['M121 50 L121 112', 'M240 54 L240 108'],
    handles: [[90, 58], [140, 58]],
    headlight: 'M322 64 L334 67 Q338 72 338 78 L324 76 Z',
    taillight: 'M7 74 L7 88 L13 88 L13 72 Z',
    sign: { x: 120, y: 1 },
  },
  sedan: {
    vb: [0, 0, 380, 140],
    sill: 122, left: 10, right: 374, R: 30,
    wheels: [{ cx: 82, cy: 111, r: 25 }, { cx: 290, cy: 111, r: 25 }],
    top: 'M 10 122 L 8 84 Q 8 66 24 64 L 92 58 Q 104 57 112 50 L 140 20 Q 146 12 158 12 L 206 12 Q 218 12 228 20 L 268 56 L 340 64 Q 362 66 370 80 Q 374 90 374 104',
    glass: ['M122 50 L144 26 Q148 20 156 20 L186 20 L186 50 Z', 'M192 20 L206 20 Q213 20 218 25 L246 50 L192 50 Z'],
    seams: ['M189 50 L189 112', 'M128 54 L128 108', 'M252 56 L252 108'],
    handles: [[160, 58], [212, 58]],
    headlight: 'M352 66 L364 68 Q369 72 370 79 L354 77 Z',
    taillight: 'M9 72 L9 86 L15 86 L15 70 Z',
    sign: { x: 168, y: 3 },
  },
  suv: {
    vb: [0, -28, 410, 168],
    sill: 122, left: 10, right: 404, R: 31,
    wheels: [{ cx: 88, cy: 111, r: 26 }, { cx: 322, cy: 111, r: 26 }],
    top: 'M 10 122 L 8 70 Q 8 52 24 46 L 44 -8 Q 48 -13 58 -13 L 270 -13 Q 284 -13 292 -4 L 338 50 L 384 58 Q 398 60 402 74 Q 404 82 404 96',
    glass: ['M40 40 L54 -3 L116 -3 L116 40 Z', 'M122 -3 L196 -3 L196 40 L122 40 Z', 'M202 -3 L268 -3 Q278 -3 284 3 L318 40 L202 40 Z'],
    seams: ['M119 40 L119 112', 'M199 40 L199 112'],
    handles: [[140, 50], [222, 50]],
    headlight: 'M384 56 L396 59 Q401 64 402 71 L386 69 Z',
    taillight: 'M9 62 L9 78 L15 78 L15 58 Z',
    sign: { x: 150, y: -22 },
  },
  tempo: {
    vb: [0, -74, 530, 216],
    sill: 122, left: 10, right: 526, R: 32,
    wheels: [{ cx: 138, cy: 109, r: 27 }, { cx: 427, cy: 109, r: 27 }],
    top: 'M 10 122 L 8 -46 Q 8 -62 24 -62 L 440 -62 Q 462 -62 470 -42 L 488 4 Q 492 12 500 16 L 514 22 Q 526 28 526 44 L 526 96',
    glass: [
      'M30 -48 L100 -48 L100 8 L30 8 Z',
      'M108 -48 L186 -48 L186 8 L108 8 Z',
      'M194 -48 L272 -48 L272 8 L194 8 Z',
      'M280 -48 L358 -48 L358 8 L280 8 Z',
      'M366 -48 L416 -48 L416 8 L366 8 Z',
      'M424 -48 L452 -48 Q462 -48 466 -38 L480 4 L424 4 Z',
    ],
    seams: ['M420 -50 L420 70', 'M276 -50 L276 100'],
    handles: [[390, 20], [300, 20]],
    headlight: 'M504 20 L516 24 Q524 30 525 38 L508 36 Z',
    taillight: 'M9 -20 L9 6 L15 6 L15 -24 Z',
    sign: null,
  },
}

export default function Vehicle({ kind = 'sedan', sign = false, scale, className = '', style }) {
  const k = KINDS[kind]
  const [, , w] = k.vb
  const sized = scale ? { width: w * scale, maxWidth: '100%' } : null
  return (
    <svg
      viewBox={k.vb.join(' ')}
      className={`block ${className}`.trim()}
      style={{ ...sized, ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx={w / 2} cy={136} rx={w / 2 - 14} ry={4} fill={INK} opacity="0.16" />
      {sign && k.sign && (
        <rect x={k.sign.x} y={k.sign.y} width="30" height="9" rx="2" fill={PLATE} stroke={INK} strokeWidth="2.5" />
      )}
      <path d={`${k.top} ${underbody(k)}`} fill={BODY} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {k.glass.map((g) => (
        <path key={g} d={g} fill={INK} />
      ))}
      {k.seams.map((s) => (
        <path key={s} d={s} stroke={INK} strokeWidth="1.5" fill="none" />
      ))}
      {k.handles.map(([x, y]) => (
        <rect key={x} x={x} y={y} width="16" height="3.5" rx="1.75" fill={INK} />
      ))}
      <path d={k.headlight} fill={PLATE} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={k.taillight} fill={TAIL} />
      {k.wheels.map(({ cx, cy, r }) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r={r} fill={INK} />
          <circle cx={cx} cy={cy} r={r * 0.52} fill={RIM} />
          <circle cx={cx} cy={cy} r={r * 0.18} fill={INK} />
        </g>
      ))}
    </svg>
  )
}
