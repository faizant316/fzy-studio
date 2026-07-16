"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "./lenis";

// Site-wide momentum scrolling (Neuralink-style glide). Uses real native scroll
// under the hood, so position: sticky and fixed keep working.
// Desktop-only: on touch devices native scrolling is already smooth, and running
// Lenis's rAF + scroll plumbing there (esp. in-app browsers like Instagram's)
// just makes scrolling feel choppy — so we skip it entirely.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
