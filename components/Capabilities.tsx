"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Item = {
  no: string;
  title: string;
  tagline: string;
  body: string;
  tags: string[];
};

const items: Item[] = [
  {
    no: "01",
    title: "Web Platforms",
    tagline: "Full-stack apps built from scratch.",
    body: "We design and engineer custom platforms end to end — accounts, roles, dashboards, and the database underneath — built to handle real volume and grow with the business, not a template stretched to fit.",
    tags: ["Next.js", "Supabase", "Auth & roles", "Dashboards"],
  },
  {
    no: "02",
    title: "Booking & Automation",
    tagline: "The operations layer that runs itself.",
    body: "Scheduling, payments, deposits, reminders, and confirmations wired together so the day-to-day runs on autopilot. The busywork a business outgrows becomes a system that just works in the background.",
    tags: ["Calendars", "Payments", "Automated email", "Reminders"],
  },
  {
    no: "03",
    title: "Design & Brand",
    tagline: "Interfaces with the polish clients expect.",
    body: "Every screen designed down to the detail — type, spacing, motion, and the small interactions that make a product feel considered. Mobile-first, fast, and unmistakably yours.",
    tags: ["UI/UX", "Mobile-first", "Motion", "Design systems"],
  },
];

export default function Capabilities() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="capabilities"
      style={{
        position: "relative",
        background: "var(--bg)",
        padding: "clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem)",
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
          <span className="eyebrow" style={{ color: "var(--accent)" }}>Capabilities</span>
          <h2 className="display" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)", color: "var(--ink)", marginTop: "1rem", maxWidth: "16ch" }}>
            One studio, the whole build
          </h2>
        </motion.div>

        <div className="hairline" />
        {items.map((it, idx) => {
          const isOpen = open === idx;
          return (
            <motion.div
              key={it.no}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="cap-row"
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto",
                  gap: "clamp(1rem, 4vw, 4rem)", alignItems: "center",
                  padding: "clamp(1.5rem, 3vw, 2.25rem) 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1rem, 4vw, 4rem)" }}>
                  <span className="eyebrow" style={{ color: isOpen ? "var(--accent)" : "var(--gray-light)", transition: "color 0.3s ease" }}>{it.no}</span>
                  <h3 className="display" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)", color: isOpen ? "var(--accent)" : "var(--ink)", letterSpacing: "-0.025em", transition: "color 0.3s ease" }}>{it.title}</h3>
                </div>
                <span className="cap-tagline" style={{ color: "var(--gray)", fontSize: "1rem", justifySelf: "end", textAlign: "right" }}>{it.tagline}</span>
                <span aria-hidden style={{ position: "relative", width: 18, height: 18, flexShrink: 0, color: isOpen ? "var(--accent)" : "var(--ink)", transition: "color 0.3s ease" }}>
                  <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 1.6, background: "currentColor", transform: "translateY(-50%)" }} />
                  <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 1.6, background: "currentColor", transform: `translateY(-50%) rotate(${isOpen ? 0 : 90}deg)`, transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)" }} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="cap-detail" style={{ paddingBottom: "clamp(1.75rem, 3.5vw, 2.5rem)", display: "grid", gap: "1.25rem" }}>
                      <p style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", lineHeight: 1.65, color: "var(--ink-soft)", maxWidth: "60ch" }}>{it.body}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {it.tags.map((t) => (
                          <span key={t} className="spec-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="hairline" />
            </motion.div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 820px) {
          .cap-row { grid-template-columns: minmax(0,1fr) auto !important; gap: 1rem !important; }
          .cap-row > div:first-child { flex-direction: column; align-items: flex-start; gap: 0.4rem !important; }
          .cap-tagline { display: none !important; }
        }
      ` }} />
    </section>
  );
}
