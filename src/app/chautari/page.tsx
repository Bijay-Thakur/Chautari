"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ChautariPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "#0d2b1a" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center"
      >
        <div className="text-6xl mb-6">🏡</div>

        <h1 className="ne text-3xl font-bold mb-3" style={{ color: "#d1fae5" }}>
          चौतारी
        </h1>
        <p className="text-green-200 text-lg mb-2">Chautari</p>
        <p className="text-green-300 text-sm mb-8 opacity-70 italic">
          A resting place. Coming soon.
        </p>

        <p className="text-green-100 leading-relaxed mb-10 text-base">
          Chautari — the resting stone under the pipal tree — is where people
          stop, share, and breathe. This peer space is being built with care.
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-xl font-semibold transition hover:opacity-90"
          style={{ background: "#16a34a", color: "#fff" }}
        >
          ← Back to Saathi
        </Link>
      </motion.div>
    </div>
  );
}
