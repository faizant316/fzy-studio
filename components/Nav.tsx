"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HERO_VIDEO } from "./heroConfig";
import { lenisScrollTo } from "./lenis";
import Brand from "./Brand";

const links = [
  { label: "Work", id: "work" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Studio", id: "studio" },
  { label: "Start a Project", id: "contact" },
];

export default function Nav() {
  // White text while sitting over the dark video hero; dark once scrolled past it.
  const [overHero, setOverHero] = useState(Boolean(HERO_VIDEO));

  useEffect(() => {
    const onScroll = () => {
      if (HERO_VIDEO) setOverHero(window.scrollY < window.innerHeight * 0.82);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkColor = overHero ? "rgba(255,255,255,0.82)" : "var(--ink-soft)";

  const go = (id: string) => lenisScrollTo("#" + id);

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem clamp(1.1rem, 2.4vw, 1.75rem)",
        background: "transparent",
      }}
    >
      <Brand />

      <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 2.2vw, 2.25rem)" }}>
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => go(l.id)}
            className="link-line"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontSize: "0.82rem",
              letterSpacing: "0.01em",
              color: linkColor,
              whiteSpace: "nowrap",
              transition: "color 0.4s ease",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
