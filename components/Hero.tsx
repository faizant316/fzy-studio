"use client";
import { motion } from "framer-motion";
import Wordmark from "./Wordmark";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        padding: "clamp(6.5rem, 11vh, 8.5rem) clamp(1.25rem, 4vw, 3rem) clamp(2rem, 5vh, 3rem)",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-grid"
        style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr", gap: "clamp(2rem, 4vw, 3rem)", width: "100%" }}
      >
        {/* Left: eyebrow (top) + headline & CTA (bottom) */}
        <div className="hero-left" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            Web Development Studio
          </motion.span>

          <div style={{ position: "relative", zIndex: 2 }}>
            <h1 className="display" style={{ fontSize: "clamp(2.3rem, 4.4vw, 4.4rem)", color: "var(--ink)", lineHeight: 1.0 }}>
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
              style={{ marginTop: "clamp(1.5rem, 3vw, 2.25rem)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.75rem" }}
            >
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="pill-solid">
                Start a Project
                <span style={{ fontSize: "0.85rem" }}>↗</span>
              </button>
              <button
                onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
                className="link-line"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0", fontSize: "1rem", color: "var(--ink-soft)" }}
              >
                View our work
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right: animated FZY */}
        <div className="hero-right" style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
          <Wordmark />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ position: "absolute", bottom: "clamp(2rem, 5vh, 3rem)", right: "clamp(1.25rem, 4vw, 3rem)", zIndex: 2 }}
      >
        <span className="eyebrow" style={{ fontSize: "0.64rem", color: "var(--gray)" }}>Scroll ↓</span>
      </motion.div>

      <style>{`
        @media (min-width: 880px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; align-items: stretch; }
        }
        @media (max-width: 879px) {
          .hero-right { order: -1; justify-content: flex-start !important; }
        }
      `}</style>
    </section>
  );
}
