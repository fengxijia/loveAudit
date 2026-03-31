"use client";

import Image from "next/image";

/**
 * Background image — ornate pink floral border on black.
 * Uses object-fit:cover so it fills the viewport on any aspect ratio
 * (landscape desktop or portrait mobile) without distortion.
 */
export default function FloralBg() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Mobile background — scaled up to reduce black edges */}
      <Image
        src="/bg-mobile.png"
        alt=""
        fill
        priority
        className="object-cover opacity-40 sm:hidden scale-120 translate-y-10"
        sizes="100vw"
      />
      {/* Desktop background */}
      <Image
        src="/bg-floral-v3.png"
        alt=""
        fill
        priority
        className="object-cover opacity-40 hidden sm:block"
        sizes="100vw"
      />
    </div>
  );
}
