"use client";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(7rem, 12vh, 9rem) clamp(1.25rem, 4vw, 3rem) clamp(2rem, 5vh, 3.5rem)",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Eyebrow top-left */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <span className="eyebrow">Web Development Studio</span>
        <span className="eyebrow" style={{ marginLeft: "0.9rem", color: "var(--gray)" }}>Sacramento, CA</span>
      </motion.div>

      {/* Oversized FZY wordmark, right side */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease }}
        style={{
          position: "absolute",
          right: "clamp(1rem, 3vw, 3rem)",
          top: "50%",
          transform: "translateY(-50%)",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 0.8,
          fontSize: "clamp(8rem, 26vw, 26rem)",
          color: "var(--ink)",
          opacity: 0.05,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        FZY
      </motion.div>

      {/* Headline + CTA, bottom-left */}
      <div style={{ marginTop: "auto", position: "relative", zIndex: 2, maxWidth: "20ch" }}>
        <h1 className="display" style={{ fontSize: "clamp(2.6rem, 7.5vw, 7rem)", color: "var(--ink)" }}>
          {["We build the platforms", "businesses run on."].map((line, i) => (
            <span key={line} style={{ display: "block", overflow: "hidden", paddingBottom: "0.02em" }}>
              <motion.span
                style={{ display: "block" }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease }}
          style={{ marginTop: "clamp(1.5rem, 3vw, 2.25rem)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}
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
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ position: "absolute", bottom: "clamp(2rem, 5vh, 3.5rem)", right: "clamp(1.25rem, 4vw, 3rem)", zIndex: 2 }}
      >
        <span className="eyebrow" style={{ fontSize: "0.66rem", color: "var(--gray)" }}>Scroll ↓</span>
      </motion.div>
    </section>
  );
}
