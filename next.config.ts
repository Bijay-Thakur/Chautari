import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  /**
   * Dev-only: allow public tunnel hostnames to load JS/CSS from `next dev`.
   * Without this, tunnel URLs often look "broken" (403 / missing chunks).
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
   */
  allowedDevOrigins: [
    "*.tunnelmole.net",
    "*.loca.lt",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
