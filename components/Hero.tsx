"use client";
import { motion } from "framer-motion";
import Wordmark from "./Wordmark";
import { HERO_VIDEO, HERO_POSTER } from "./heroConfig";
import { lenisScrollTo } from "./lenis";

const ease = [0.22, 1, 0.36, 1] as const;

function Headline({ light }: { light: boolean }) {
  const color = light ? "#fff" : "var(--ink)";
  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <h1 className="display" style={{ fontSize: "clamp(2.3rem, 4.4vw, 4.4rem)", color, lineHeight: 1.0 }}>
        {["From idea", "to live platform."].map((line, i) => (
          <motion.span
            key={line}
            style={{ display: "block" }}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4 + i * 0.12, ease }}
          >
            {line}
          </motion.span>
        ))}
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.74, ease }}
        style={{ marginTop: "clamp(1.5rem, 3vw, 2.25rem)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}
      >
        <button
          onClick={() => lenisScrollTo("#contact")}
          className="pill-solid"
          style={light ? { background: "#fff", color: "#0a0a0a", borderColor: "#fff" } : undefined}
        >
          Let&rsquo;s build
          <span style={{ fontSize: "0.85rem" }}>↗</span>
        </button>
        <OutlinePill light={light} onClick={() => lenisScrollTo("#work")}>View our work</OutlinePill>
      </motion.div>
    </div>
  );
}

function OutlinePill({ light, onClick, children }: { light: boolean; onClick: () => void; children: React.ReactNode }) {
  const border = light ? "rgba(255,255,255,0.55)" : "var(--line-strong)";
  const color = light ? "#fff" : "var(--ink)";
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.55rem",
        padding: "0.85rem 1.6rem", borderRadius: 100,
        border: `1px solid ${border}`, background: "transparent", color,
        fontSize: "0.92rem", fontWeight: 500, cursor: "pointer",
        transition: "background 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = light ? "#fff" : "var(--ink)"; e.currentTarget.style.color = light ? "#0a0a0a" : "#fff"; e.currentTarget.style.borderColor = light ? "#fff" : "var(--ink)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = color; e.currentTarget.style.borderColor = border; }}
    >
      {children}
      <span style={{ fontSize: "0.8rem" }}>↗</span>
    </button>
  );
}

const gridStyle: React.CSSProperties = { flex: 1, display: "grid", gridTemplateColumns: "1fr", gap: "clamp(2rem, 4vw, 3rem)", width: "100%" };

const HeroStyles = () => (
  <style>{`
    @media (min-width: 880px) { .hero-grid { grid-template-columns: 1fr 1fr !important; align-items: stretch; } }
    @media (max-width: 879px) { .hero-right { order: -1; justify-content: flex-start !important; } }
  `}</style>
);

export default function Hero() {
  // ── Video mode (Neuralink-style full-bleed background) ──
  if (HERO_VIDEO) {
    return (
      <section style={{ position: "relative", minHeight: "100svh", display: "flex", overflow: "hidden", background: "#0a0a0a", padding: "clamp(6.5rem, 11vh, 8.5rem) clamp(1.25rem, 4vw, 3rem) clamp(2rem, 5vh, 3rem)" }}>
        <video autoPlay muted loop playsInline poster={HERO_POSTER || undefined} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(10,10,10,0.42) 0%, rgba(10,10,10,0.12) 20%, rgba(10,10,10,0.12) 48%, rgba(10,10,10,0.72) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(105deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 55%)" }} />

        <div className="hero-grid" style={{ ...gridStyle, position: "relative", zIndex: 2 }}>
          <div className="hero-left" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", minWidth: 0 }}>
            <Headline light />
          </div>
          <div className="hero-right" style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
            <Wordmark light />
          </div>
        </div>
        <HeroStyles />
      </section>
    );
  }

  // ── Default: clean white hero with the animated FZY ──
  return (
    <section style={{ position: "relative", minHeight: "100svh", display: "flex", padding: "clamp(6.5rem, 11vh, 8.5rem) clamp(1.25rem, 4vw, 3rem) clamp(2rem, 5vh, 3rem)", background: "var(--bg)", overflow: "hidden" }}>
      <div className="hero-grid" style={gridStyle}>
        <div className="hero-left" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease }}>
            Web Development Studio
          </motion.span>
          <Headline light={false} />
        </div>
        <div className="hero-right" style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
          <Wordmark />
        </div>
      </div>
      <HeroStyles />
    </section>
  );
}
