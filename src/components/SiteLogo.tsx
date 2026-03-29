"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HOME_PATHS = new Set(["/", "/home"]);

export default function SiteLogo() {
  const pathname = usePathname();
  if (!pathname || HOME_PATHS.has(pathname)) {
    return null;
  }

  return (
    <Link
      href="/home"
      className="group fixed left-4 top-4 z-[60] flex items-center justify-center rounded-2xl border border-[rgba(220,190,130,0.14)] bg-[rgba(10,8,7,0.72)] px-2.5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:border-[rgba(220,190,130,0.28)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_28px_rgba(52,211,153,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0807] active:scale-[0.98] sm:left-5 sm:top-5"
      aria-label="Chautari — back to home"
    >
      <Image
        src="/images/Logo.png"
        alt=""
        width={140}
        height={44}
        className="h-9 w-auto max-w-[min(42vw,9.5rem)] object-contain object-left opacity-[0.96] transition-opacity duration-300 group-hover:opacity-100 sm:h-10 sm:max-w-[10.5rem]"
        sizes="(max-width: 640px) 42vw, 168px"
        priority={false}
      />
    </Link>
  );
}
