"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HERO_VIDEO } from "./heroConfig";

const links = [
  { label: "Work", id: "work" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Studio", id: "studio" },
  { label: "Start a Project", id: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  // White text while sitting over the dark video hero; dark once scrolled past it.
  const [overHero, setOverHero] = useState(Boolean(HERO_VIDEO));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (HERO_VIDEO) setOverHero(window.scrollY < window.innerHeight * 0.82);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brandColor = overHero ? "#fff" : "var(--ink)";
  const linkColor = overHero ? "rgba(255,255,255,0.82)" : "var(--ink-soft)";

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

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
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "backdrop-filter 0.4s ease",
      }}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="FZY home"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600, fontSize: "1rem", letterSpacing: "0.24em", color: brandColor, transition: "color 0.4s ease" }}
      >
        FZY
      </button>

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
