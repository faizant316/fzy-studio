"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", id: "work" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Studio", id: "studio" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.15rem clamp(1.25rem, 4vw, 3rem)",
          background: scrolled ? "rgba(255,255,255,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="FZY home"
          style={{
            display: "flex", alignItems: "center", gap: "0.55rem",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          <Mark />
          <span style={{ fontWeight: 600, fontSize: "1.05rem", letterSpacing: "0.22em", color: "var(--ink)" }}>FZY</span>
        </button>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: "2.25rem" }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="link-line"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "0.95rem", color: "var(--ink-soft)" }}
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => go("contact")} className="pill" style={{ padding: "0.55rem 1.25rem", fontSize: "0.9rem" }}>
            Start a Project
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", gap: "5px", zIndex: 70 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                y: menuOpen ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
              transition={{ duration: 0.22 }}
              style={{ width: 24, height: 1.5, background: "var(--ink)", display: "block" }}
            />
          ))}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
            style={{
              position: "fixed", inset: 0, zIndex: 55,
              background: "var(--bg)",
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "flex-start",
              padding: "0 2rem", gap: "0.5rem",
            }}
          >
            {[...links, { label: "Start a Project", id: "contact" }].map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                onClick={() => go(l.id)}
                className="display"
                style={{ fontSize: "clamp(2.2rem, 10vw, 3.4rem)", color: "var(--ink)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Minimal waveform monogram */
function Mark() {
  return (
    <svg width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden>
      <path d="M1 7 H6 L9 1 L13 13 L17 7 H25" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
