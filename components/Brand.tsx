"use client";
import { useEffect, useState } from "react";
import { HERO_VIDEO } from "./heroConfig";
import { lenisScrollTo } from "./lenis";

const ease = "cubic-bezier(0.22,1,0.36,1)";

// FZY home button. Over the video hero it shows a large solid-white wordmark with
// a small "Web Development" tag beneath it. It shrinks to the compact mark the
// moment the rising headline reaches it (driven by the headline's real position,
// not a fixed scroll offset), and flips to dark ink once past the hero.
export default function Brand() {
  const [big, setBig] = useState(Boolean(HERO_VIDEO));
  const [dark, setDark] = useState(Boolean(HERO_VIDEO));

  useEffect(() => {
    if (!HERO_VIDEO) return;
    const onScroll = () => {
      const copy = document.getElementById("hero-copy");
      const hero = document.getElementById("hero");
      // Stay big while the headline is still comfortably below the mark; shrink
      // right as it climbs into the mark's zone (~the bottom of the big FZY).
      if (copy) setBig(copy.getBoundingClientRect().top > 168);
      // White over the dark hero, ink once the hero has scrolled out under the nav.
      if (hero) setDark(hero.getBoundingClientRect().bottom > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const color = dark ? "#fff" : "var(--ink)";

  if (!HERO_VIDEO) {
    return (
      <button onClick={() => lenisScrollTo(0)} aria-label="FZY home" style={{ ...btn, fontWeight: 600, fontSize: "1rem", letterSpacing: "0.24em", color: "var(--ink)" }}>
        FZY
      </button>
    );
  }

  return (
    <button onClick={() => lenisScrollTo(0)} aria-label="FZY home" style={{ ...btn, position: "relative", overflow: "visible" }}>
      {/* Compact mark — in flow, sets the nav height; shown once shrunk. */}
      <span style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "0.24em", whiteSpace: "nowrap", color, opacity: big ? 0 : 1, transition: "opacity 0.35s ease, color 0.4s ease" }}>
        FZY
      </span>

      {/* Large lockup — absolute overlay, grows down into the hero. Bold FZY
          with a small italic "Web Development" line tucked beneath it. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: "-0.04em",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.45rem",
          whiteSpace: "nowrap",
          transformOrigin: "left top",
          transform: big ? "scale(1)" : "scale(0.42)",
          opacity: big ? 1 : 0,
          transition: `opacity 0.35s ease, transform 0.55s ${ease}`,
          pointerEvents: "none",
          color,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "clamp(3.4rem, 6vw, 5rem)", letterSpacing: "-0.03em", lineHeight: 0.9, textShadow: "0 2px 22px rgba(0,0,0,0.35)" }}>
          FZY
        </span>
        <span style={{ ...flank, paddingLeft: "0.14em" }}>Web Development</span>
      </span>
    </button>
  );
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

// Small italic tagline under the wordmark — quiet, refined, high-end.
const flank: React.CSSProperties = {
  fontStyle: "italic",
  fontWeight: 400,
  fontSize: "0.82rem",
  letterSpacing: "0.07em",
  opacity: 0.82,
  textShadow: "0 1px 12px rgba(0,0,0,0.45)",
};
