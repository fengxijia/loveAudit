"use client";

import Image from "next/image";

interface FloralBgProps {
  variant?: "hero" | "subtle";
}

export default function FloralBg({ variant = "subtle" }: FloralBgProps) {
  const imageOpacity = variant === "hero" ? "opacity-8" : "opacity-6";
  const overlayClass =
    variant === "hero"
      ? "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.94),transparent_32%),linear-gradient(180deg,rgba(247,242,236,0.985),rgba(247,242,236,0.992))]"
      : "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_38%),linear-gradient(180deg,rgba(228,234,239,0.975),rgba(236,241,245,0.985))]";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <Image
        src="/bg-mobile.png"
        alt=""
        fill
        priority
        unoptimized
        className={`object-cover sm:hidden blur-[1px] ${imageOpacity}`}
        sizes="100vw"
      />
      <Image
        src="/bg-floral-v3.png"
        alt=""
        fill
        priority
        unoptimized
        className={`object-cover hidden sm:block blur-[1px] ${imageOpacity}`}
        sizes="100vw"
      />
      <div className={overlayClass} />
      {variant === "hero" && (
        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgba(247,242,236,0.98),rgba(247,242,236,0.88),transparent)]" />
      )}
    </div>
  );
}
