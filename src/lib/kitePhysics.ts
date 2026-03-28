export function generateKiteMotion() {
  return {
    rotate: [-4 + Math.random() * 8, 3 + Math.random() * 6, -6 - Math.random() * 4],
    x: [0, -12 + Math.random() * 24, 8 - Math.random() * 16, 0],
    y: [0, -10 - Math.random() * 16, -6 - Math.random() * 10, 0],
    duration: 7 + Math.random() * 5,
    delay: Math.random() * 4,
  };
}

export const KITE_COLORS = [
  { fill: "#c0392b", glow: "rgba(192,57,43,0.35)", tail: "#e74c3c" },
  { fill: "#2d6a4f", glow: "rgba(45,106,79,0.35)", tail: "#6fcf97" },
  { fill: "#6c3483", glow: "rgba(108,52,131,0.35)", tail: "#c39bd3" },
  { fill: "#b7950b", glow: "rgba(183,149,11,0.35)", tail: "#f5a623" },
  { fill: "#1a5276", glow: "rgba(26,82,118,0.35)", tail: "#5dade2" },
  { fill: "#784212", glow: "rgba(120,66,18,0.35)", tail: "#f0a500" },
  { fill: "#4a235a", glow: "rgba(74,35,90,0.35)", tail: "#a569bd" },
];
