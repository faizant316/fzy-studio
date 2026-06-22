import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

// Smoothly scroll to a target (element, selector, or pixel offset), routed
// through Lenis so programmatic scrolls glide instead of fighting the momentum.
export function lenisScrollTo(target: string | number | HTMLElement) {
  if (instance) {
    const opts = typeof target === "number" ? { duration: 1.2 } : { duration: 1.2, offset: -70 };
    instance.scrollTo(target, opts);
    return;
  }
  if (typeof window === "undefined") return;
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
}

export function lenisStop() {
  instance?.stop();
}
export function lenisStart() {
  instance?.start();
}

// Snap Lenis (and native scroll) to an exact position with no animation. Used
// when closing an overlay so the page returns to where it was instead of
// gliding from the top back down to the section.
export function lenisResync(y: number) {
  if (instance) {
    instance.resize();
    instance.scrollTo(y, { immediate: true, force: true });
  } else if (typeof window !== "undefined") {
    window.scrollTo(0, y);
  }
}
