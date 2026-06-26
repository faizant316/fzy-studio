"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Step = {
  no: string;
  title: string;
  body: string;
  detail: string[];
};

const steps: Step[] = [
  {
    no: "01",
    title: "Scope",
    body: "We map how you actually work — the goals, the bottlenecks, the must-haves — and turn it into a clear plan and a fixed scope before a single line of code.",
    detail: ["Goals & workflow", "Fixed scope", "Clear timeline"],
  },
  {
    no: "02",
    title: "Design",
    body: "Every screen is designed before it's built — layout, type, motion, the small interactions. You see and sign off on the look before we engineer it.",
    detail: ["Wireframes → UI", "Mobile-first", "Your sign-off"],
  },
  {
    no: "03",
    title: "Build",
    body: "We engineer the real thing end to end — accounts, dashboards, payments, the database underneath — and you watch it come together instead of waiting in the dark.",
    detail: ["Full-stack build", "Live previews", "Built to scale"],
  },
  {
    no: "04",
    title: "Launch & support",
    body: "We deploy it live on your domain and stay on after — so the thing keeps running, and you're never left to figure it out alone.",
    detail: ["Deployed live", "Handover", "Support window"],
  },
];

export default function Process() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 62%", "end 65%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="process"
      style={{
        position: "relative",
        background: "var(--bg)",
        padding: "clamp(5rem, 11vw, 9rem) clamp(1.25rem, 4vw, 3rem)",
      }}
    >
      <div className="proc-grid" style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
        {/* Left: sticky editorial header */}
        <div className="proc-head">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="eyebrow" style={{ color: "var(--accent)" }}>Process</span>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)", color: "var(--ink)", marginTop: "1rem", maxWidth: "12ch" }}>
              From idea to live, end to end
            </h2>
            <p style={{ marginTop: "1.5rem", fontSize: "clamp(1rem, 1.4vw, 1.1rem)", lineHeight: 1.65, color: "var(--gray)", maxWidth: "34ch" }}>
              No black box, no agency telephone game. One studio, four clear steps — you always know exactly where your build is.
            </p>
          </motion.div>
        </div>

        {/* Right: stepped track with a scroll-linked progress line */}
        <div ref={trackRef} className="proc-track" style={{ position: "relative" }}>
          {/* Rail — faint full-height guide */}
          <div aria-hidden style={{ position: "absolute", left: 6, top: "0.55rem", bottom: "0.55rem", width: 2, background: "var(--line)", borderRadius: 2 }} />
          {/* Rail — accent fill that draws as you scroll */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute", left: 6, top: "0.55rem", bottom: "0.55rem", width: 2, borderRadius: 2,
              background: "linear-gradient(var(--accent), var(--accent-deep))",
              transformOrigin: "top",
              scaleY: reduce ? 1 : lineScale,
            }}
          />

          {steps.map((s, idx) => (
            <motion.div
              key={s.no}
              initial="rest"
              whileInView="live"
              viewport={{ once: true, margin: "0px 0px -22% 0px" }}
              transition={{ duration: 0.7, delay: idx * 0.05, ease }}
              variants={{ rest: { opacity: 0, y: 20 }, live: { opacity: 1, y: 0 } }}
              style={{ position: "relative", paddingLeft: "clamp(2.25rem, 4vw, 3.25rem)", paddingTop: idx === 0 ? 0 : "clamp(2.5rem, 4.5vw, 3.75rem)" }}
            >
              {/* Node on the rail */}
              <motion.span
                aria-hidden
                variants={{
                  rest: { background: "#0a0a0b", borderColor: "rgba(255,255,255,0.18)" },
                  live: { background: "#7aa2e3", borderColor: "#7aa2e3" },
                }}
                transition={{ duration: 0.5, ease }}
                style={{ position: "absolute", left: 0, top: "0.35rem", width: 14, height: 14, borderRadius: "50%", border: "2px solid", boxSizing: "border-box" }}
              />

              <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(0.85rem, 2vw, 1.5rem)" }}>
                <span className="eyebrow" style={{ color: "var(--gray-light)" }}>{s.no}</span>
                <h3 className="display" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)", color: "var(--ink)", letterSpacing: "-0.025em" }}>{s.title}</h3>
              </div>

              <p style={{ marginTop: "0.9rem", fontSize: "clamp(1rem, 1.3vw, 1.12rem)", lineHeight: 1.65, color: "var(--ink-soft)", maxWidth: "52ch" }}>{s.body}</p>

              <div style={{ marginTop: "1.1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {s.detail.map((d) => (
                  <span key={d} className="spec-tag">{d}</span>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Honest, concrete close — ties to the package timelines below */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.7, ease }}
            style={{ marginTop: "clamp(2.75rem, 5vw, 4rem)", paddingLeft: "clamp(2.25rem, 4vw, 3.25rem)", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--gray)" }}
          >
            Most builds go from first call to live in <span style={{ color: "var(--ink)" }}>two to six weeks</span>.
          </motion.p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .proc-grid { display: grid; grid-template-columns: 1fr; gap: clamp(2.5rem, 5vw, 4rem); }
        @media (min-width: 900px) {
          .proc-grid { grid-template-columns: 0.82fr 1.18fr; gap: clamp(3rem, 6vw, 6rem); align-items: start; }
          .proc-head { position: sticky; top: clamp(5rem, 14vh, 8rem); }
        }
      ` }} />
    </section>
  );
}
