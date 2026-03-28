const USERNAME_KEY = "saathi_username";

export function saveUsername(username: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERNAME_KEY, username.trim());
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function clearUsername() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USERNAME_KEY);
}
