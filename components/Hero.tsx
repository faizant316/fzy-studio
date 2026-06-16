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
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "clamp(6.5rem, 11vh, 8.5rem) clamp(1.25rem, 4vw, 3rem) clamp(2rem, 5vh, 3rem)",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Top: tiny eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <span className="eyebrow">Web Development Studio</span>
      </motion.div>

      {/* Middle: animated FZY, right-aligned, vertically centered */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", minHeight: 0 }}>
        <Wordmark className="hero-mark" />
      </div>

      {/* Bottom-left: headline + CTAs */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "16ch" }}>
        <h1 className="display" style={{ fontSize: "clamp(2.4rem, 6.2vw, 5.6rem)", color: "var(--ink)" }}>
          {["From idea", "to live platform."].map((line, i) => (
            <span key={line} style={{ display: "block", overflow: "hidden", paddingBottom: "0.04em" }}>
              <motion.span
                style={{ display: "block" }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78, ease }}
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

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ position: "absolute", bottom: "clamp(2rem, 5vh, 3rem)", right: "clamp(1.25rem, 4vw, 3rem)", zIndex: 2 }}
      >
        <span className="eyebrow" style={{ fontSize: "0.64rem", color: "var(--gray)" }}>Scroll ↓</span>
      </motion.div>

      <style>{`
        @media (max-width: 760px) {
          .hero-mark { opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}
