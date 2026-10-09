"use client";
import { useEffect, useState } from "react";

/* True while the fixed nav (a thin band at the top of the viewport) sits over a
   light "paper" section, marked with data-paper. The nav flips to dark ink there
   so it never disappears against the cream. */
export function useOnPaper(probeY = 34) {
  const [onPaper, setOnPaper] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const els = document.querySelectorAll<HTMLElement>("[data-paper]");
      let hit = false;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) hit = true;
      });
      setOnPaper(hit);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [probeY]);

  return onPaper;
}
