"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { setAuthCookie } from "@/lib/authCookie";
import BirdsLayer from "@/components/animations/BirdsLayer";

const ease = [0.22, 1, 0.36, 1] as const;

const textWarm = "#ebe3d6";

const shadowOverImage =
  "0 1px 2px rgba(12, 9, 7, 0.2), 0 0 18px rgba(10, 7, 5, 0.22), 0 0 36px rgba(8, 6, 4, 0.12)";

const shadowOnButton =
  "0 1px 2px rgba(0, 0, 0, 0.32), 0 0 14px rgba(0, 0, 0, 0.18)";

export default function LandingPage() {
  const router = useRouter();

  function handleSitByTheFire() {
    setAuthCookie();
    router.push("/home");
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/Chautari.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,10,6,0.55) 0%, rgba(18,10,6,0.08) 32%, transparent 48%, rgba(10,6,4,0.5) 100%)",
        }}
        aria-hidden
      />
      <BirdsLayer />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-between px-6 pb-14 pt-16 sm:px-10 sm:pb-16 sm:pt-20">
        <motion.div
          className="mx-auto w-full max-w-xl text-center font-display"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease }}
        >
          <h1
            className="text-[clamp(1.5rem,4.5vw,2.5rem)] font-medium leading-snug tracking-tight"
            style={{ color: textWarm, textShadow: shadowOverImage }}
          >
            You don&apos;t have to carry everything alone.
          </h1>
          <p
            className="mt-5 text-[clamp(1.05rem,3vw,1.4rem)] font-normal leading-relaxed"
            style={{ color: textWarm, textShadow: shadowOverImage }}
          >
            Sit for a moment. Breathe.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto flex w-full max-w-md flex-col items-center gap-10 pb-2 font-display"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease }}
        >
          <p
            className="text-center text-[clamp(1rem,2.8vw,1.2rem)] font-medium leading-relaxed"
            style={{ color: textWarm, textShadow: shadowOverImage }}
          >
            What have you been carrying lately?
          </p>

          <button
            type="button"
            onClick={handleSitByTheFire}
            className="w-full max-w-[min(100%,22rem)] rounded-full px-12 py-4 text-center text-[clamp(0.95rem,2.4vw,1.1rem)] font-medium tracking-wide transition-[transform,filter] hover:brightness-110 active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              color: textWarm,
              background: "linear-gradient(180deg, #6b4420 0%, #4d2f14 100%)",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,220,190,0.12)",
              textShadow: shadowOnButton,
            }}
          >
            Sit by the fire
          </button>
        </motion.div>
      </div>
    </div>
  );
}
