// Seven poster-style scenes in the site's own colours. They are original drawings of generic subjects (a river
// temple, a brick temple, a forest, a hilltop shrine, a stone temple, a waterfall, a hill station), not copies of
// any photo or artwork. Decorative, so hidden from screen readers. Motion (.scene-*) lives in trips.css.
//
// Layout rule for new scenes: keep the top-left of the sky clear. The Devanagari place name is set there.
const Y = '#F6C000'
const YD = '#DDAA00'
const YL = '#FFD84A'
const K = '#24272C'
const KS = '#3A3E45'
const W = '#F2F4F1'
const R = '#C8372D'

function Frame({ children }) {
  return (
    <svg
      viewBox="0 0 480 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

// Small seeded random, so a scene is drawn the same way every time.
function seeded(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A band of tree tops: overlapping circles over a solid base. By default it runs to the bottom of the picture
// and across all of it; `x0`/`x1` and `bottom` keep it to one corner so it cannot paint over a fall or a lake.
function Canopy({ y, seed, r0, r1, fill = K, opacity = 1, x0 = -10, x1 = 490, bottom = 300 }) {
  const rnd = seeded(seed)
  const blobs = []
  for (let x = x0; x < x1; x += (r0 + r1) * 0.75) {
    blobs.push([x + rnd() * 8, y + rnd() * 10 - 5, r0 + rnd() * (r1 - r0)])
  }
  return (
    <g fill={fill} opacity={opacity}>
      {blobs.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx.toFixed(1)} cy={cy.toFixed(1)} r={r.toFixed(1)} />
      ))}
      <rect x={x0} y={y} width={x1 - x0 + 10} height={bottom - y} />
    </g>
  )
}

const Birds = ({ items, color = K }) => (
  <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    {items.map(([x, y, s], i) => (
      <path key={i} d="M0 0q5-6 10 0q5-6 10 0" transform={`translate(${x} ${y}) scale(${s})`} />
    ))}
  </g>
)

const Tree = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={K}>
    <path d="M-4 0L-3-46L-14-62L-9-63L-2-52L2-80L6-52L14-66L18-62L5-44L4 0Z" />
    <circle cx="-22" cy="-82" r="22" />
    <circle cx="2" cy="-100" r="28" />
    <circle cx="26" cy="-82" r="22" />
    <circle cx="2" cy="-72" r="20" />
  </g>
)

const Pine = ({ x, y, s = 1, opacity = 0.7 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={K} opacity={opacity}>
    <path d="M0-44L-10-26H10Z" />
    <path d="M0-34L-13-12H13Z" />
    <path d="M0-22L-16 0H16Z" />
    <rect x="-2" y="0" width="4" height="6" />
  </g>
)

const Deer = ({ x, y, s = 1, stag = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={K}>
    <ellipse cx="0" cy="-34" rx="26" ry="12" />
    <path d="M16-40L30-68L40-65L28-34Z" />
    <ellipse cx="38" cy="-68" rx="10" ry="5.5" transform="rotate(-20 38 -68)" />
    <path d="M32-72L27-83L37-74Z" />
    <path d="M-26-38L-35-45L-27-30Z" />
    <rect x="-20" y="-28" width="3.2" height="30" rx="1.5" />
    <rect x="-11" y="-28" width="3.2" height="30" rx="1.5" />
    <rect x="12" y="-28" width="3.2" height="30" rx="1.5" />
    <rect x="21" y="-28" width="3.2" height="30" rx="1.5" />
    {stag && (
      <path
        d="M38-73L34-94M34-94L24-100M34-94L37-106M36-83L26-87"
        stroke={K}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    )}
  </g>
)

function Rajim() {
  return (
    <Frame>
      <defs>
        <linearGradient id="rj-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={Y} />
          <stop offset="1" stopColor={YL} />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill="url(#rj-sky)" />
      <circle cx="372" cy="94" r="40" fill={W} />
      <Birds items={[[300, 60, 1], [330, 48, 0.8], [286, 84, 0.7]]} />
      <Canopy y={216} seed={3} r0={10} r1={18} opacity={0.3} />
      {/* the temple on the river bank */}
      <path d="M176 156C182 122 197 92 220 52C243 92 258 122 264 156Z" fill={K} />
      <path d="M187 140H253M193 126H247M199 112H241M206 98H234M212 84H228" stroke={YD} strokeWidth="2" fill="none" />
      <ellipse cx="220" cy="57" rx="15" ry="5" fill={KS} />
      <path d="M220 52V36" stroke={K} strokeWidth="3" />
      <circle cx="220" cy="33" r="4.5" fill={K} />
      <path d="M221 30V14" stroke={K} strokeWidth="2.5" />
      <path d="M221 14L243 20L221 26Z" fill={R} />
      <path d="M150 170H290L280 156H160Z" fill={KS} />
      <rect x="158" y="168" width="124" height="38" fill={K} />
      <path
        d="M172 206v-18a8 8 0 0 1 16 0v18zM212 206v-18a8 8 0 0 1 16 0v18zM252 206v-18a8 8 0 0 1 16 0v18z"
        fill={YD}
      />
      <rect x="146" y="206" width="148" height="10" fill={KS} />
      <rect x="136" y="216" width="168" height="12" fill={K} />
      <rect x="124" y="228" width="192" height="6" fill={KS} />
      <rect x="114" y="234" width="212" height="6" fill={K} />
      {/* three rivers meeting */}
      <rect y="240" width="480" height="60" fill={KS} />
      <g fill="none" stroke={W} strokeWidth="3" strokeLinecap="round" strokeDasharray="14 12">
        <path d="M-10 270C80 258 160 262 240 276" />
        <path d="M490 258C400 256 320 264 240 276" />
        <path d="M110 306C160 296 200 288 240 276" />
      </g>
      <Tree x={58} y={242} s={0.8} />
      <Tree x={424} y={242} s={0.7} />
    </Frame>
  )
}

function Sirpur() {
  const niche = ([x, y]) => <path key={`${x}-${y}`} d={`M${x - 4} ${y}v-7a4 4 0 0 1 8 0v7z`} fill={K} opacity="0.55" />
  return (
    <Frame>
      <rect width="480" height="300" fill={Y} />
      <circle cx="392" cy="96" r="36" fill={W} />
      <Birds items={[[318, 66, 0.9], [342, 54, 0.7]]} />
      {/* mahua tree */}
      <rect x="66" y="176" width="8" height="64" fill={K} />
      <circle cx="70" cy="150" r="36" fill={K} />
      <circle cx="46" cy="170" r="24" fill={K} />
      <circle cx="96" cy="166" r="26" fill={K} />
      {/* the brick temple */}
      <rect x="142" y="226" width="196" height="14" fill={K} />
      <rect x="152" y="214" width="176" height="12" fill={KS} />
      <rect x="168" y="152" width="144" height="62" fill={R} />
      <path d="M226 214v-34a14 14 0 0 1 28 0v34z" fill={K} />
      <path d="M186 156v56M202 156v56M278 156v56M294 156v56" stroke={K} strokeWidth="3" opacity="0.35" />
      <rect x="162" y="146" width="156" height="8" fill={K} />
      <rect x="184" y="118" width="112" height="28" fill={R} />
      <rect x="180" y="112" width="120" height="6" fill={K} opacity="0.7" />
      <rect x="198" y="90" width="84" height="22" fill={R} />
      <rect x="194" y="84" width="92" height="6" fill={K} opacity="0.7" />
      <rect x="212" y="66" width="56" height="18" fill={R} />
      <rect x="208" y="60" width="64" height="6" fill={K} opacity="0.7" />
      <path d="M224 60h32l-6-12h-20z" fill={R} />
      <ellipse cx="240" cy="46" rx="13" ry="5" fill={K} />
      <path d="M240 41V28" stroke={K} strokeWidth="3" />
      {[[212, 140], [240, 140], [268, 140], [226, 106], [254, 106], [240, 80]].map(niche)}
      {/* ruined walls */}
      <rect x="352" y="224" width="52" height="16" fill={R} />
      <rect x="372" y="208" width="32" height="16" fill={R} />
      <rect x="388" y="196" width="16" height="12" fill={R} />
      <rect x="96" y="228" width="30" height="12" fill={R} />
      <rect y="240" width="480" height="60" fill={K} />
    </Frame>
  )
}

const GRASS = Array.from({ length: 54 }, (_, i) => `M${i * 9} 250l3-${7 + ((i * 5) % 6)}l3 ${7 + ((i * 5) % 6)}`).join('')

function Barnawapara() {
  return (
    <Frame>
      <defs>
        <linearGradient id="bw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={Y} />
          <stop offset="1" stopColor={YL} />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill="url(#bw-sky)" />
      <circle cx="352" cy="186" r="64" fill={W} />
      <Birds items={[[408, 66, 0.9], [432, 54, 0.7], [388, 84, 0.6]]} />
      <Canopy y={198} seed={7} r0={12} r1={22} opacity={0.3} />
      <Canopy y={220} seed={11} r0={14} r1={26} opacity={0.6} />
      <Tree x={62} y={256} s={1.05} />
      <Tree x={432} y={258} s={0.9} />
      <rect y="250" width="480" height="50" fill={K} />
      <path d={GRASS} fill={K} />
      <Deer x={188} y={256} s={1.1} stag />
      <Deer x={296} y={262} s={0.82} />
    </Frame>
  )
}

function Dongargarh() {
  return (
    <Frame>
      <rect width="480" height="300" fill={Y} />
      <circle cx="404" cy="88" r="30" fill={R} />
      <Birds items={[[330, 54, 0.9], [352, 42, 0.7]]} />
      <path d="M96 300C150 262 186 204 226 152C250 120 282 116 306 148C336 192 378 262 440 300Z" fill={KS} />
      <path d="M150 264C190 246 250 248 330 260M170 230C200 216 240 216 286 226" stroke={K} strokeWidth="2" opacity="0.35" fill="none" />
      {/* the climb to the shrine */}
      <path
        d="M204 292L248 268L224 246L262 224L240 202L272 180L254 158L270 134"
        stroke={W}
        strokeWidth="2.5"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.85"
      />
      <rect x="254" y="120" width="28" height="10" fill={W} />
      <rect x="258" y="106" width="20" height="14" fill={W} />
      <path d="M257 106Q268 70 279 106Z" fill={W} />
      <path d="M268 78V60" stroke={K} strokeWidth="2.5" />
      <path d="M268 60L288 66L268 72Z" fill={R} />
      {/* foreground hills */}
      <path d="M0 300V250C40 238 80 244 120 270L150 300Z" fill={K} />
      <path d="M330 300C370 272 410 258 480 254V300Z" fill={K} />
      {/* ropeway */}
      <path d="M88 238L262 108" stroke={K} strokeWidth="2" />
      <path d="M80 252V232h16v20z" fill={K} />
      <g transform="translate(109 222)">
        <g className="scene-cabin">
          <path d="M0 0V7" stroke={K} strokeWidth="1.5" />
          <rect x="-9" y="7" width="18" height="13" rx="2" fill={R} />
          <rect x="-6" y="10" width="12" height="5" fill={W} />
        </g>
      </g>
    </Frame>
  )
}

function Bhoramdeo() {
  return (
    <Frame>
      <defs>
        <linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K} />
          <stop offset="1" stopColor={KS} />
        </linearGradient>
        <clipPath id="bd-pond">
          <rect y="232" width="480" height="68" />
        </clipPath>
        <g id="bd-temple">
          <rect x="120" y="222" width="240" height="10" fill={W} opacity="0.7" />
          <rect x="132" y="212" width="216" height="10" fill={W} opacity="0.85" />
          <rect x="144" y="202" width="192" height="10" fill={W} />
          <path d="M150 174H330L318 160H162Z" fill={W} />
          <path d="M170 160H310L298 148H182Z" fill={W} opacity="0.9" />
          <rect x="156" y="174" width="168" height="28" fill={W} />
          <g fill={K}>
            {[170, 194, 218, 242, 266, 290].map((x) => (
              <rect key={x} x={x} y="180" width="12" height="22" />
            ))}
          </g>
          <path d="M190 148C196 110 214 80 240 40C266 80 284 110 290 148Z" fill={W} />
          <path d="M200 132H280M206 116H274M213 100H267M221 84H259M229 68H251" stroke={K} strokeWidth="2" opacity="0.35" fill="none" />
          <path d="M220 148C222 110 230 76 240 44M260 148C258 110 250 76 240 44" stroke={K} strokeWidth="1.5" opacity="0.25" fill="none" />
          <ellipse cx="240" cy="46" rx="16" ry="6" fill={W} />
          <path d="M240 41V26" stroke={W} strokeWidth="3" />
          <circle cx="240" cy="23" r="4" fill={W} />
        </g>
      </defs>
      <rect width="480" height="300" fill="url(#bd-sky)" />
      <ellipse cx="240" cy="232" rx="270" ry="64" fill={Y} opacity="0.16" />
      <circle cx="396" cy="70" r="38" fill={Y} opacity="0.18" />
      <circle cx="396" cy="70" r="24" fill={Y} />
      <g fill={W}>
        {[[300, 38], [346, 62], [440, 30], [456, 100], [282, 96], [418, 128], [330, 112]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" opacity="0.8" />
        ))}
      </g>
      <use href="#bd-temple" x="50" />
      <rect y="232" width="480" height="68" fill={KS} />
      <g clipPath="url(#bd-pond)">
        <g transform="translate(0 464) scale(1 -1)" opacity="0.2">
          <use href="#bd-temple" x="50" />
        </g>
      </g>
      <g stroke={W} strokeWidth="2" strokeLinecap="round" opacity="0.25">
        <path d="M60 262h50M360 270h70M200 284h60" />
      </g>
    </Frame>
  )
}

function Chitrakote() {
  // Streaks follow the horseshoe: the lip dips in the middle and the foot of the fall curves the same way.
  const N = 26
  const streaks = Array.from({ length: N }, (_, i) => {
    const f = i / (N - 1)
    const x = 62 + f * 356
    const t = (x - 50) / 380
    const top = 126 + 68 * t * (1 - t) + 6
    const xb = x + (f - 0.5) * 10
    const tb = (xb - 44) / 392
    const bottom = 226 + 52 * tb * (1 - tb) - 6
    return {
      d: `M${x.toFixed(1)} ${top.toFixed(1)}L${xb.toFixed(1)} ${bottom.toFixed(1)}`,
      // the falling ones are straight and start one dash period (24) early, so sliding the group down by 24 looks endless
      fall: `M${x.toFixed(1)} ${(top - 24).toFixed(1)}V${bottom.toFixed(1)}`,
      thick: i % 3 === 0,
      moving: i % 2 === 0,
    }
  })
  return (
    <Frame>
      <defs>
        <linearGradient id="ck-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DADDD6" />
          <stop offset="1" stopColor={W} />
        </linearGradient>
        {/* the curtain, inset 6 from its edges: the falling streaks are clipped to it */}
        <clipPath id="ck-curtain">
          <path d="M50 132Q240 166 430 132L436 220Q240 246 44 220Z" />
        </clipPath>
      </defs>
      <rect width="480" height="300" fill="url(#ck-sky)" />
      <circle cx="404" cy="62" r="24" fill={Y} />
      {/* far jungle along the horizon, then the river above the fall and the curtain of water */}
      <Canopy y={100} seed={21} r0={12} r1={22} fill={KS} opacity={0.9} bottom={150} />
      <path d="M50 126Q240 160 430 126L430 112Q240 146 50 112Z" fill={W} opacity="0.9" />
      <path d="M50 126Q240 160 430 126L436 226Q240 252 44 226Z" fill={W} />
      <g fill="none" stroke={KS} strokeLinecap="round">
        {streaks.map((s, i) => !s.moving && <path key={i} d={s.d} strokeWidth={s.thick ? 2.4 : 1.3} opacity="0.22" />)}
      </g>
      {/* the clip sits on the outer group so it stays put while the inner one slides */}
      <g clipPath="url(#ck-curtain)">
        <g fill="none" stroke={KS} strokeLinecap="round" strokeDasharray="10 14" opacity="0.22" className="scene-fall">
          {streaks.map((s, i) => s.moving && <path key={i} d={s.fall} strokeWidth={s.thick ? 2.4 : 1.3} />)}
        </g>
      </g>
      {/* rock and jungle either side, kept to the corners so the curtain stays clear */}
      <path d="M0 92L52 126L44 228L0 248Z" fill={KS} />
      <path d="M480 92L428 126L436 228L480 248Z" fill={KS} />
      <Canopy y={86} seed={5} r0={14} r1={24} x0={-10} x1={36} bottom={236} />
      <Canopy y={86} seed={9} r0={14} r1={24} x0={440} x1={490} bottom={236} />
      {/* spray and the river below */}
      <g className="scene-drift" fill={W} opacity="0.6">
        <ellipse cx="96" cy="238" rx="58" ry="14" />
        <ellipse cx="170" cy="244" rx="50" ry="12" />
        <ellipse cx="250" cy="250" rx="60" ry="14" />
        <ellipse cx="330" cy="244" rx="52" ry="12" />
        <ellipse cx="400" cy="238" rx="56" ry="14" />
      </g>
      <path d="M0 250Q240 274 480 250V300H0Z" fill={KS} />
      <path d="M40 276h60M170 284h90M330 278h80" stroke={W} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M0 300V264Q30 254 60 270L90 300Z" fill={K} />
      <path d="M480 300V266Q450 256 420 272L392 300Z" fill={K} />
    </Frame>
  )
}

function Mainpat() {
  return (
    <Frame>
      <defs>
        <linearGradient id="mp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={W} />
          <stop offset="1" stopColor={YL} />
        </linearGradient>
        <linearGradient id="mp-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={W} stopOpacity="0" />
          <stop offset="1" stopColor={W} stopOpacity="0.75" />
        </linearGradient>
        <clipPath id="mp-stream">
          <rect x="308" y="230" width="20" height="32" />
        </clipPath>
      </defs>
      <rect width="480" height="300" fill="url(#mp-sky)" />
      <circle cx="376" cy="100" r="34" fill={Y} />
      <path d="M0 172Q60 142 120 162T240 152T360 160T480 142V300H0Z" fill={K} opacity="0.1" />
      <rect y="150" width="480" height="40" fill="url(#mp-mist)" />
      <path d="M0 192Q80 162 160 186T320 178T480 170V300H0Z" fill={K} opacity="0.2" />
      <rect y="176" width="480" height="40" fill="url(#mp-mist)" />
      <path d="M0 216Q100 188 200 210T400 202T480 198V300H0Z" fill={K} opacity="0.36" />
      <rect y="206" width="480" height="40" fill="url(#mp-mist)" />
      <path d="M0 238Q90 214 180 232T300 226H480V300H0Z" fill={K} opacity="0.62" />
      <Pine x={40} y={230} s={0.9} />
      <Pine x={66} y={228} s={1.1} />
      <Pine x={98} y={232} s={0.8} />
      <Pine x={398} y={222} s={1} />
      <Pine x={424} y={220} s={1.2} />
      <Pine x={452} y={224} s={0.9} />
      {/* the waterfall */}
      <path d="M318 228V264" stroke={W} strokeWidth="7" strokeLinecap="round" />
      <g clipPath="url(#mp-stream)">
        <g className="scene-fall" style={{ '--fall': '18px' }}>
          <path d="M318 212V262" stroke={KS} strokeWidth="1.5" strokeDasharray="8 10" opacity="0.5" />
        </g>
      </g>
      <g className="scene-drift" fill={W}>
        <ellipse cx="312" cy="266" rx="30" ry="8" opacity="0.7" />
        <ellipse cx="338" cy="270" rx="24" ry="6" opacity="0.55" />
      </g>
      {/* the viewpoint */}
      <path d="M0 274H480V300H0Z" fill={K} />
      <path d="M14 262v16M44 262v16M74 262v16M104 262v16M134 262v16M164 262v16M194 262v16" stroke={K} strokeWidth="3" />
      <path d="M8 266H204" stroke={K} strokeWidth="3.5" />
    </Frame>
  )
}

export const scenes = {
  rajim: Rajim,
  sirpur: Sirpur,
  barnawapara: Barnawapara,
  dongargarh: Dongargarh,
  bhoramdeo: Bhoramdeo,
  chitrakote: Chitrakote,
  mainpat: Mainpat,
}
