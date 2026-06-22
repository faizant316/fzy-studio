"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_VIDEO } from "./heroConfig";
import { lenisScrollTo, lenisStop, lenisStart } from "./lenis";
import Brand from "./Brand";

const ease = [0.22, 1, 0.36, 1] as const;

const links = [
  { label: "Work", id: "work" },
  { label: "Capabilities", id: "capabilities" },
  { label: "Studio", id: "studio" },
  { label: "Start a Project", id: "contact" },
];

export default function Nav() {
  // White text while sitting over the dark video hero; soft ink once scrolled past.
  const [overHero, setOverHero] = useState(Boolean(HERO_VIDEO));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (HERO_VIDEO) setOverHero(window.scrollY < window.innerHeight * 0.82);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the full-screen menu WITHOUT moving the scroll position
  // (overflow:hidden keeps you exactly where you were — no jump on close).
  useEffect(() => {
    if (!open) return;
    lenisStop();
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      lenisStart();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkColor = overHero ? "rgba(255,255,255,0.82)" : "var(--ink-soft)";

  const go = (id: string) => lenisScrollTo("#" + id);

  // From the mobile menu: close first (unlock + restore scroll), then glide there.
  const goFromMenu = (id: string) => {
    setOpen(false);
    setTimeout(() => lenisScrollTo("#" + id), 60);
  };

  // Over the dark menu the burger should always read white; otherwise follow the hero/scroll state.
  const burgerColor = open ? "#ffffff" : overHero ? "rgba(255,255,255,0.92)" : "var(--ink)";

  return (
    <>
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem clamp(1.1rem, 2.4vw, 1.75rem)",
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          background: "transparent",
        }}
      >
        <Brand forceLight={open} />

        {/* Desktop links */}
        <div className="nav-links" style={{ alignItems: "center", gap: "clamp(1rem, 2.2vw, 2.25rem)" }}>
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

        {/* Mobile hamburger → X */}
        <button
          className="nav-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{
            width: 44, height: 44, borderRadius: 999, border: "none",
            background: "transparent", cursor: "pointer", position: "relative",
            display: "none", alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{ position: "relative", display: "block", width: 22, height: 14 }}>
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease }}
              style={{ ...barStyle, top: 0, background: burgerColor }}
            />
            <motion.span
              animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.25, ease }}
              style={{ ...barStyle, top: 6, background: burgerColor }}
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.4, ease }}
              style={{ ...barStyle, top: 12, background: burgerColor }}
            />
          </span>
        </button>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            style={{
              position: "fixed", inset: 0, zIndex: 70,
              background: "radial-gradient(120% 90% at 85% 0%, rgba(122,162,227,0.10) 0%, rgba(10,10,11,0) 55%), linear-gradient(160deg, #101013 0%, #070708 100%)",
              display: "flex", flexDirection: "column",
              padding: "calc(env(safe-area-inset-top) + 5.5rem) clamp(1.5rem, 7vw, 3rem) calc(env(safe-area-inset-bottom) + 2rem)",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: "auto" }}>
              {links.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => goFromMenu(l.id)}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.55, delay: 0.08 + i * 0.07, ease }}
                  className="menu-link"
                  style={{
                    display: "flex", alignItems: "baseline", gap: "1rem",
                    background: "none", border: "none", cursor: "pointer",
                    padding: "clamp(0.55rem, 2.2vw, 0.85rem) 0", textAlign: "left",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span className="eyebrow" style={{ fontSize: "0.7rem", color: "var(--gray-light)", minWidth: "2.2rem" }}>
                    0{i + 1}
                  </span>
                  <span className="display" style={{ fontSize: "clamp(2.2rem, 11vw, 3.4rem)", color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.34, ease }}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem", justifyContent: "space-between", alignItems: "center" }}
            >
              <a href="mailto:hello@fzydev.com" className="link-line" style={{ color: "var(--ink-soft)", fontSize: "0.95rem" }}>
                hello@fzydev.com
              </a>
              <span className="eyebrow" style={{ color: "var(--gray)" }}>Sacramento, CA</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-links { display: flex; }
        .nav-burger { display: none; }
        .menu-link .display { transition: color 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        @media (hover: hover) {
          .menu-link:hover .display { color: var(--accent); transform: translateX(8px); }
        }
        .menu-link:active .display { color: var(--accent); }
        @media (max-width: 860px) {
          .nav-links { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      ` }} />
    </>
  );
}

const barStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  width: "100%",
  height: 1.6,
  borderRadius: 2,
  transformOrigin: "center",
  transition: "background 0.4s ease",
};
