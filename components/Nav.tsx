"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", id: "work" },
  { label: "Services", id: "services" },
  { label: "Process", id: "process" },
  { label: "Contact", id: "contact" },
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
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem clamp(1.25rem, 5vw, 3.5rem)",
          background: scrolled ? "rgba(10,10,10,0.72)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(245,240,235,0.07)" : "1px solid transparent",
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: "1.4rem",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "var(--cream)",
            background: "none", border: "none", cursor: "pointer",
            padding: 0, lineHeight: 1,
          }}
        >
          FZY
        </button>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: "2.5rem" }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="link-sweep"
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                fontFamily: "var(--font-inter)",
                fontSize: "0.9rem",
                color: "rgba(245,240,235,0.66)",
                transition: "color 0.25s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,240,235,0.66)")}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("contact")}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--ink)",
              background: "var(--cream)",
              border: "none",
              borderRadius: "100px",
              padding: "0.6rem 1.4rem",
              cursor: "pointer",
              transition: "transform 0.25s ease, background 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-soft)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Start a project
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", gap: "6px", zIndex: 70 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                y: menuOpen ? (i === 0 ? 8 : i === 2 ? -8 : 0) : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
              transition={{ duration: 0.22 }}
              style={{ width: 24, height: 1.5, background: "var(--cream)", display: "block" }}
            />
          ))}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden"
            style={{
              position: "fixed", inset: 0, zIndex: 55,
              background: "var(--ink)",
              display: "flex", flexDirection: "column",
              justifyContent: "flex-end", alignItems: "flex-start",
              padding: "4rem 2rem", gap: "0.4rem",
            }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.07, duration: 0.4 }}
                onClick={() => go(l.id)}
                className="font-display"
                style={{
                  fontSize: "clamp(2.5rem, 11vw, 4rem)",
                  fontWeight: 700, letterSpacing: "-0.03em",
                  color: "var(--cream)", background: "none", border: "none",
                  cursor: "pointer", textAlign: "left", lineHeight: 1.05,
                }}
              >
                {l.label}
              </motion.button>
            ))}
            <p className="font-mono" style={{ marginTop: "2rem", fontSize: "0.78rem", color: "var(--gold)" }}>
              hello@fzystudio.dev
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
