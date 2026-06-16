"use client";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.8, delay, ease },
});

export default function Statement() {
  return (
    <section
      id="studio"
      style={{
        background: "var(--bg)",
        padding: "clamp(5rem, 12vw, 10rem) clamp(1.25rem, 4vw, 3rem)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: "clamp(2.5rem, 5vw, 5rem)",
        }}
        className="statement-grid"
      >
        <motion.h2 {...fade(0)} className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.9rem)", color: "var(--ink)", maxWidth: "14ch" }}>
          Designing and building software that runs real businesses
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "46ch" }}>
          <motion.p {...fade(0.1)} style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.6, color: "var(--ink-soft)" }}>
            FZY is a web development studio. We design and engineer custom platforms end to end:
            booking systems, client dashboards, payment tracking, and the automation that ties it
            all together.
          </motion.p>
          <motion.p {...fade(0.18)} style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.6, color: "var(--gray)" }}>
            The work replaces the spreadsheets, DMs, and busywork that businesses outgrow, with one
            considered product that looks the part and runs without you.
          </motion.p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .statement-grid { grid-template-columns: 1.1fr 1fr !important; align-items: start; }
        }
      `}</style>
    </section>
  );
}
