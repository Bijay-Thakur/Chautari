type KiteSVGProps = {
  color: string;
  tailColor: string;
  size?: number;
};

export function KiteSVG({ color, tailColor, size = 62 }: KiteSVGProps) {
  const h = size * 1.28;
  const cx = size / 2;
  const cy = size * 0.5;
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`}>
      {/* Main kite diamond */}
      <polygon
        points={`${cx},4 ${size - 4},${cy} ${cx},${size - 4} 4,${cy}`}
        fill={color}
        opacity={0.88}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />
      {/* Cross lines */}
      <line x1={4} y1={cy} x2={size - 4} y2={cy} stroke="rgba(255,255,255,0.09)" strokeWidth={0.8} />
      <line x1={cx} y1={4} x2={cx} y2={size - 4} stroke="rgba(255,255,255,0.09)" strokeWidth={0.8} />
      {/* Sheen */}
      <polygon
        points={`${cx},4 ${size - 4},${cy} ${cx},${size - 4}`}
        fill="rgba(255,255,255,0.06)"
      />
      {/* Tail */}
      <path
        d={`M${cx} ${size - 4} Q${cx + 4} ${size} ${cx - 2} ${size + 5} Q${cx - 5} ${size + 9} ${cx} ${size + 12}`}
        stroke={tailColor}
        strokeWidth={1.3}
        fill="none"
        opacity={0.65}
      />
    </svg>
  );
}
