"use client";
import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Project = {
  client: string;
  category: string;
  year: string;
  quote: string;
  detail: string;
  tint: string;   // dark gradient base
  glow: string;   // sage/hue radial accent
  url?: string;
};

const projects: Project[] = [
  {
    client: "Makeup by Roko",
    category: "Bridal Booking Platform",
    year: "2025",
    quote: "It took my whole business out of my DMs and built something that runs itself.",
    detail: "A full-stack booking platform: client scheduling, calendar management, deposit tracking, and automated confirmations. Built mobile-first and live with real clients.",
    tint: "linear-gradient(150deg, #1a1416 0%, #100c0e 100%)",
    glow: "radial-gradient(80% 70% at 78% 18%, rgba(224,120,108,0.22) 0%, rgba(16,12,14,0) 60%)",
    url: "https://makeupbyroko.vercel.app",
  },
  {
    client: "HVAC Service Co.",
    category: "Operations Platform",
    year: "2025",
    quote: "Every job, quote, and customer in one place instead of five.",
    detail: "An operations layer for a field-service business: scheduling, customer records, and quoting, designed to be run from a phone in the field.",
    tint: "linear-gradient(150deg, #14181f 0%, #0c0e12 100%)",
    glow: "radial-gradient(80% 70% at 78% 18%, rgba(122,162,227,0.22) 0%, rgba(12,14,18,0) 60%)",
  },
  {
    client: "Tone Translator",
    category: "AI Writing Tool",
    year: "2025",
    quote: "Rewrites anything into the exact tone you need, in a click.",
    detail: "An AI writing tool that rewrites messages into any tone or register, built around a clean, focused single-purpose interface.",
    tint: "linear-gradient(150deg, #17151f 0%, #100e15 100%)",
    glow: "radial-gradient(80% 70% at 78% 18%, rgba(168,150,224,0.20) 0%, rgba(15,13,20,0) 60%)",
  },
];

export default function Work() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const p = projects[i];

  const go = (n: number) => {
    setDir(n > i || (i === projects.length - 1 && n === 0) ? 1 : -1);
    setI((n + projects.length) % projects.length);
  };
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  // Swipe the visual on touch / trackpad to move between platforms.
  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -60 || velocity.x < -450) next();
    else if (offset.x > 60 || velocity.x > 450) prev();
  };

  return (
    <section
      id="work"
      className="grain"
      style={{
        background: "var(--tone-a)",
        padding: "clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.8, ease }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "clamp(1.5rem, 3vw, 2.25rem)" }}
        >
          <div>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>Selected Work</span>
            <h2 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "var(--ink)", marginTop: "0.9rem", letterSpacing: "-0.035em" }}>
              Platforms we&rsquo;ve built
            </h2>
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--gray)", paddingBottom: "0.5rem" }}>Real platforms, live with real clients.</span>
        </motion.div>

        <div className="hairline" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }} />
        {/* Visual — swipeable */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          onDragEnd={onDragEnd}
          whileTap={{ cursor: "grabbing" }}
          style={{
            position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "16/9",
            background: "var(--surface)", border: "1px solid var(--line)",
            cursor: "grab", touchAction: "pan-y", userSelect: "none",
          }}
        >
          <AnimatePresence mode="popLayout" custom={dir}>
            <motion.div
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.6, ease }}
              style={{
                position: "absolute", inset: 0,
                background: p.tint,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: p.glow }} />
              <span className="display" style={{ position: "relative", fontSize: "clamp(1.9rem, 6vw, 5rem)", color: "var(--ink)", opacity: 0.96, textAlign: "center", padding: "0 1.2rem", pointerEvents: "none" }}>
                {p.client}
              </span>
              <span style={{ position: "absolute", top: "1.4rem", left: "1.4rem" }} className="eyebrow">{p.category}</span>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onDragStart={(e) => e.preventDefault()}
                  className="pill"
                  style={{ position: "absolute", top: "1.1rem", right: "1.1rem", padding: "0.45rem 1.1rem", fontSize: "0.82rem", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(6px)", borderColor: "rgba(255,255,255,0.28)", color: "#fff" }}
                >
                  Live ↗
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Caption row */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "2rem", alignItems: "end", marginTop: "clamp(1.75rem, 4vw, 2.75rem)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="display" style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.3rem)", color: "var(--ink)", maxWidth: "20ch", letterSpacing: "-0.02em", lineHeight: 1.14 }}>
                &ldquo;{p.quote}&rdquo;
              </p>
              <p style={{ marginTop: "1.25rem", fontSize: "0.95rem", color: "var(--gray)", maxWidth: "52ch", lineHeight: 1.65 }}>{p.detail}</p>
              <div style={{ marginTop: "1.4rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>{p.client}</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gray-light)" }} />
                <span className="eyebrow" style={{ color: "var(--gray)" }}>{p.category} · {p.year}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows (desktop) */}
          <div className="work-arrows" style={{ gap: "0.75rem" }}>
            <ArrowBtn onClick={prev} label="Previous">←</ArrowBtn>
            <ArrowBtn onClick={next} label="Next">→</ArrowBtn>
          </div>
        </div>

        {/* Progress segments + swipe hint */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "clamp(2rem, 4vw, 3rem)" }}>
          <div style={{ display: "flex", gap: "0.6rem", flex: 1 }}>
            {projects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => go(idx)}
                aria-label={`Go to project ${idx + 1}`}
                style={{ flex: 1, height: 2, border: "none", padding: 0, cursor: "pointer", background: idx === i ? "var(--accent)" : "var(--line-strong)", transition: "background 0.4s ease" }}
              />
            ))}
          </div>
          <span className="work-swipe" style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gray-light)", whiteSpace: "nowrap" }}>
            Swipe →
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .work-arrows { display: flex; }
        .work-swipe { display: none; }
        @media (max-width: 760px) {
          .work-arrows { display: none; }
          .work-swipe { display: inline; }
        }
      ` }} />
    </section>
  );
}

function ArrowBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 56, height: 56, borderRadius: "50%",
        border: "1px solid var(--line-strong)", background: "transparent",
        cursor: "pointer", fontSize: "1.1rem", color: "var(--ink)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--bg)"; e.currentTarget.style.borderColor = "var(--ink)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--line-strong)"; }}
    >
      {children}
    </button>
  );
}
