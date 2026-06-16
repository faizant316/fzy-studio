"use client";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const items = [
  { no: "01", title: "Web Platforms", body: "Full-stack platforms built from scratch. Booking systems, client portals, and admin workspaces engineered to handle real volume." },
  { no: "02", title: "Booking & Automation", body: "The operations layer that runs a business on autopilot. Calendars, payment tracking, and automated email so nothing slips." },
  { no: "03", title: "Design & Brand", body: "Interfaces with the polish clients expect. Every screen designed mobile-first, considered down to the detail." },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      style={{ background: "var(--bg)", padding: "clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem)" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.8, ease }}
          style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <span className="eyebrow">Capabilities</span>
          <h2 className="display" style={{ fontSize: "clamp(2rem, 4.6vw, 3.8rem)", color: "var(--ink)", marginTop: "1rem", maxWidth: "16ch" }}>
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
          >
            <div
              className="cap-row"
              style={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0,1fr)",
                gap: "clamp(1.5rem, 4vw, 4rem)",
                alignItems: "baseline",
                padding: "clamp(1.75rem, 3.5vw, 2.75rem) 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1.5rem, 4vw, 4rem)" }}>
                <span className="eyebrow" style={{ color: "var(--gray-light)" }}>{it.no}</span>
                <h3 className="display" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)", color: "var(--ink)", letterSpacing: "-0.025em" }}>{it.title}</h3>
              </div>
              <p style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)", lineHeight: 1.6, color: "var(--gray)", maxWidth: "48ch", justifySelf: "end" }}>{it.body}</p>
            </div>
            <div className="hairline" />
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 760px) {
          .cap-row { grid-template-columns: minmax(0,1fr) !important; gap: 1rem !important; }
          .cap-row > div { flex-direction: column; gap: 0.5rem !important; }
        }
      `}</style>
    </section>
  );
}
