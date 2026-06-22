"use client";
import { useEffect, useState } from "react";
import { HERO_VIDEO } from "./heroConfig";
import { lenisScrollTo } from "./lenis";

// FZY home button — a compact wordmark that matches the nav. Over the dark video
// hero it shows in white, then settles to soft ink once the hero scrolls out under
// the nav. `forceLight` keeps it white while the full-screen menu is open.
export default function Brand({ forceLight = false }: { forceLight?: boolean }) {
  const [dark, setDark] = useState(Boolean(HERO_VIDEO));

  useEffect(() => {
    if (!HERO_VIDEO) return;
    const onScroll = () => {
      const hero = document.getElementById("hero");
      // White over the dark hero, ink once the hero has scrolled out under the nav.
      if (hero) setDark(hero.getBoundingClientRect().bottom > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const color = forceLight || dark ? "#fff" : "var(--ink)";

  return (
    <button
      onClick={() => lenisScrollTo(0)}
      aria-label="FZY home"
      style={{ ...btn, fontWeight: 600, fontSize: "1rem", letterSpacing: "0.24em", color, transition: "color 0.4s ease", zIndex: 1, position: "relative" }}
    >
      FZY
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
