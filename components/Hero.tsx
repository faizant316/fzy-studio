"use client";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      className="grain"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem clamp(1.25rem, 5vw, 3.5rem) 4rem",
        overflow: "hidden",
      }}
    >
      {/* Gold glow */}
      <div
        className="glow-gold breathe"
        style={{
          position: "absolute",
          top: "-12%", right: "-8%",
          width: "60vw", height: "60vw",
          maxWidth: 820, maxHeight: 820,
          zIndex: 0, pointerEvents: "none",
        }}
      />
      {/* Faint grid lines */}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(245,240,235,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,235,0.025) 1px, transparent 1px)",
          backgroundSize: "clamp(60px, 8vw, 120px) clamp(60px, 8vw, 120px)",
          maskImage: "radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 30%, transparent 80%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "2rem" }}
        >
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
          <span className="eyebrow">Web Development Studio · Sacramento, CA</span>
        </motion.div>

        <h1
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: "clamp(2.9rem, 8vw, 8rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.015em",
            color: "var(--cream)",
            maxWidth: "15ch",
          }}
        >
          {["We build web platforms", "for businesses that", "mean business."].map((line, i) => (
            <span key={line} style={{ display: "block", overflow: "hidden", paddingBottom: "0.04em" }}>
              <motion.span
                style={{ display: "block" }}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.95, delay: 0.2 + i * 0.1, ease }}
              >
                {i === 2 ? (
                  <>
                    mean <span className="text-gold-grad serif-italic">business.</span>
                  </>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          style={{
            marginTop: "2rem",
            maxWidth: "46ch",
            fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
            lineHeight: 1.65,
            color: "rgba(245,240,235,0.55)",
          }}
        >
          FZY is a studio that designs and engineers custom platforms end to end.
          Booking systems, client dashboards, and automation, built to replace the
          spreadsheets and DMs that real businesses outgrow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.74, ease }}
          style={{ marginTop: "2.75rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}
        >
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.7rem",
              background: "var(--cream)", color: "var(--ink)",
              border: "none", borderRadius: "100px",
              padding: "1rem 2rem", fontSize: "0.95rem", fontWeight: 500,
              cursor: "pointer", transition: "transform 0.25s ease, background 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-soft)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Start a project
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "var(--ink)", color: "var(--cream)", fontSize: "0.75rem" }}>→</span>
          </button>
          <button
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="link-sweep"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(245,240,235,0.7)", fontSize: "0.95rem", padding: "0.5rem 0",
            }}
          >
            See selected work
          </button>
        </motion.div>
      </div>

      {/* Bottom meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{
          position: "absolute",
          bottom: "2rem", left: "clamp(1.25rem, 5vw, 3.5rem)", right: "clamp(1.25rem, 5vw, 3.5rem)",
          zIndex: 2,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem",
        }}
      >
        <span className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,240,235,0.3)" }}>
          Scroll ↓
        </span>
        <span className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,240,235,0.3)", textAlign: "right" }}>
          Est. 2026 · Full-stack
        </span>
      </motion.div>
    </section>
  );
}
