export function generateKiteMotion() {
  return {
    rotate: [-4 + Math.random() * 8, 3 + Math.random() * 6, -6 - Math.random() * 4],
    x: [0, -12 + Math.random() * 24, 8 - Math.random() * 16, 0],
    y: [0, -10 - Math.random() * 16, -6 - Math.random() * 10, 0],
    duration: 7 + Math.random() * 5,
    delay: Math.random() * 4,
  };
}

/*
  Each entry:
    fill      — kite body color (must match the color value stored in DB / seedKites)
    glow      — rgba for drop-shadow (higher opacity = stronger halo)
    tail      — accent color for the tail string and bow decorations
*/
export const KITE_COLORS = [
  { fill: "#c0392b", glow: "rgba(220, 72, 56,  0.68)", tail: "#ff8a80" }, // crimson
  { fill: "#2d6a4f", glow: "rgba(42,  112, 78,  0.62)", tail: "#55efc4" }, // emerald
  { fill: "#6c3483", glow: "rgba(122, 56,  150, 0.68)", tail: "#d7a4f8" }, // violet
  { fill: "#b7950b", glow: "rgba(200, 162, 14,  0.65)", tail: "#ffe066" }, // gold
  { fill: "#1a5276", glow: "rgba(26,  100, 138, 0.62)", tail: "#74b9ff" }, // ocean
  { fill: "#784212", glow: "rgba(145, 80,  22,  0.62)", tail: "#fdcb6e" }, // amber
  { fill: "#4a235a", glow: "rgba(95,  45,  115, 0.68)", tail: "#c39bd3" }, // plum
];
