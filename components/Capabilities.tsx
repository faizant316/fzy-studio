"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const items = [
  { no: "01", title: "Web Platforms", body: "Full-stack platforms built from scratch. Booking systems, client portals, and admin workspaces engineered to handle real volume." },
  { no: "02", title: "Booking & Automation", body: "The operations layer that runs a business on autopilot. Calendars, payment tracking, and automated email so nothing slips." },
  { no: "03", title: "Design & Brand", body: "Interfaces with the polish clients expect. Every screen designed mobile-first, considered down to the detail." },
];

export default function Capabilities() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section
      id="capabilities"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 0,
        background: "var(--bg)",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        padding: "clamp(5rem, 10vw, 7rem) clamp(1.25rem, 4vw, 3rem)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.8, ease }}
          style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <span className="eyebrow">Capabilities</span>
          <h2 className="display" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)", color: "var(--ink)", marginTop: "1rem", maxWidth: "16ch" }}>
            One studio, the whole build
          </h2>
        </motion.div>

        <div className="hairline" />
        {items.map((it, idx) => (
          <motion.div
            key={it.no}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.7, delay: idx * 0.08, ease }}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
          >
            <div
              className="cap-row"
              style={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0,1fr) auto",
                gap: "clamp(1.5rem, 4vw, 4rem)",
                alignItems: "center",
                padding: "clamp(1.75rem, 3.5vw, 2.75rem) 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1.5rem, 4vw, 4rem)", transition: "transform 0.4s ease", transform: hover === idx ? "translateX(10px)" : "none" }}>
                <span className="eyebrow" style={{ color: hover === idx ? "var(--ink)" : "var(--gray-light)", transition: "color 0.3s ease" }}>{it.no}</span>
                <h3 className="display" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)", color: "var(--ink)", letterSpacing: "-0.025em" }}>{it.title}</h3>
              </div>
              <p className="cap-body" style={{ fontSize: "clamp(1rem, 1.3vw, 1.1rem)", lineHeight: 1.6, color: "var(--gray)", maxWidth: "46ch", justifySelf: "end" }}>{it.body}</p>
              <span className="cap-arrow" aria-hidden style={{ fontSize: "1.3rem", color: "var(--ink)", opacity: hover === idx ? 1 : 0, transform: hover === idx ? "translateX(0)" : "translateX(-8px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>↗</span>
            </div>
            <div className="hairline" />
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .cap-row { grid-template-columns: minmax(0,1fr) !important; gap: 1rem !important; }
          .cap-row > div:first-child { flex-direction: column; gap: 0.5rem !important; }
          .cap-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}
