type KiteSVGProps = {
  color: string;
  tailColor: string;
  size?: number;
};

export function KiteSVG({ color, tailColor, size = 88 }: KiteSVGProps) {
  /* Extra height below the kite body to accommodate the decorative tail */
  const h = Math.round(size * 2.15);
  const cx = size / 2;
  const cy = size / 2;

  /* Unique gradient/filter IDs per color so multiple kites on screen are
     independent — SVG defs are scoped to each <svg> element. */
  const uid = `k${color.replace(/[^a-fA-F0-9]/g, "")}`;

  /* Named corners of the diamond */
  const T = `${cx},4`;             // top
  const R = `${size - 4},${cy}`;   // right
  const B = `${cx},${size - 4}`;   // bottom
  const L = `4,${cy}`;             // left
  const C = `${cx},${cy}`;         // center

  /* Tail geometry */
  const tailY = size - 4;    // bottom tip of diamond
  const b1y   = tailY + 27;  // first bow center
  const b2y   = tailY + 56;  // second bow center

  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
      <defs>
        {/*
          Radial gradient simulates sunlight hitting the top-right quadrant:
          bright white highlight fades toward a shadowed bottom-left corner.
        */}
        <radialGradient id={`${uid}-rg`} cx="65%" cy="24%" r="74%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.52)" />
          <stop offset="28%"  stopColor="rgba(255,255,255,0.10)" />
          <stop offset="68%"  stopColor="rgba(0,0,0,0.04)"      />
          <stop offset="100%" stopColor="rgba(0,0,0,0.22)"      />
        </radialGradient>
      </defs>

      {/* ── Layer 1: base fill across the full diamond ── */}
      <polygon
        points={`${T} ${R} ${B} ${L}`}
        fill={color}
        opacity={0.92}
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />

      {/* ── Layer 2: shadow facet — bottom-left quadrant ── */}
      <polygon points={`${C} ${L} ${B}`} fill="rgba(0,0,0,0.22)" />

      {/* ── Layer 3: light facet — top-right quadrant ── */}
      <polygon points={`${C} ${T} ${R}`} fill="rgba(255,255,255,0.13)" />

      {/* ── Layer 4: radial lighting gradient across full diamond ── */}
      <polygon points={`${T} ${R} ${B} ${L}`} fill={`url(#${uid}-rg)`} />

      {/* ── Structural lines ── */}
      {/* Vertical spine — bright, central axis */}
      <line
        x1={cx} y1={4} x2={cx} y2={size - 4}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth={0.65}
        strokeLinecap="round"
      />
      {/* Horizontal cross-piece — subtler */}
      <line
        x1={4} y1={cy} x2={size - 4} y2={cy}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={0.55}
        strokeLinecap="round"
      />

      {/* ── Center knot where spine meets cross-piece ── */}
      <circle cx={cx} cy={cy} r={2.4} fill="rgba(255,255,255,0.48)" />
      <circle cx={cx} cy={cy} r={1.1} fill="rgba(255,255,255,0.88)" />

      {/* ── Top-tip string attachment hole ── */}
      <circle cx={cx} cy={4} r={1.6} fill="rgba(255,255,255,0.6)" />

      {/* ── Tail string — flowing S-curve ── */}
      <path
        d={`
          M${cx} ${tailY}
          C${cx + 8}  ${tailY + 9},
           ${cx - 6}  ${tailY + 18},
           ${cx}      ${b1y}
          C${cx + 7}  ${b1y + 10},
           ${cx - 7}  ${b1y + 20},
           ${cx}      ${b2y}
          C${cx + 5}  ${b2y + 9},
           ${cx - 4}  ${b2y + 16},
           ${cx - 1}  ${tailY + 75}
        `}
        stroke={tailColor}
        strokeWidth={1.7}
        fill="none"
        opacity={0.85}
        strokeLinecap="round"
      />

      {/* ── Decorative bow 1 ── */}
      <ellipse
        cx={cx + 8}  cy={b1y}  rx={5.8} ry={2.6}
        fill={tailColor} opacity={0.62}
        transform={`rotate(22 ${cx + 8} ${b1y})`}
      />
      <ellipse
        cx={cx - 8}  cy={b1y}  rx={5.8} ry={2.6}
        fill={tailColor} opacity={0.62}
        transform={`rotate(-22 ${cx - 8} ${b1y})`}
      />
      {/* bow 1 knot */}
      <circle cx={cx} cy={b1y} r={2} fill={tailColor} opacity={0.78} />

      {/* ── Decorative bow 2 (smaller, further down) ── */}
      <ellipse
        cx={cx + 6.5} cy={b2y} rx={4.6} ry={2}
        fill={tailColor} opacity={0.48}
        transform={`rotate(28 ${cx + 6.5} ${b2y})`}
      />
      <ellipse
        cx={cx - 6.5} cy={b2y} rx={4.6} ry={2}
        fill={tailColor} opacity={0.48}
        transform={`rotate(-28 ${cx - 6.5} ${b2y})`}
      />
      {/* bow 2 knot */}
      <circle cx={cx} cy={b2y} r={1.5} fill={tailColor} opacity={0.62} />
    </svg>
  );
}
