const adj = ["Quiet", "Gentle", "Wandering", "Still", "Brave", "Soft", "Rising", "Steady", "Warm", "Open"];
const noun = ["Pahari", "Nadi", "Tara", "Hawa", "Bato", "Phool", "Dhara", "Aakash", "Joon", "Batas"];

export function generateAnonName(): string {
  return adj[Math.floor(Math.random() * adj.length)] + noun[Math.floor(Math.random() * noun.length)];
}
