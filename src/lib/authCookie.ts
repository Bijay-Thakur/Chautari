import { SAATHI_AUTH_COOKIE, SAATHI_AUTH_VALUE } from "@/constants/auth";

export function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SAATHI_AUTH_COOKIE}=${SAATHI_AUTH_VALUE}; Path=/; Max-Age=604800; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SAATHI_AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
