"use client";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    no: "01",
    title: "Discovery",
    body: "We start with the problem, not the pixels. How your business actually runs, where it breaks, and what a platform needs to do to fix it.",
  },
  {
    no: "02",
    title: "Design",
    body: "Mobile-first wireframes and a polished interface mapped to your brand. You see the product before a line of code is written.",
  },
  {
    no: "03",
    title: "Build",
    body: "Full-stack engineering with real data, auth, and automation. Built in the open with progress you can watch deploy live.",
  },
  {
    no: "04",
    title: "Launch & Beyond",
    body: "We ship it, hand over the keys, and stay on for the iteration. Your platform grows as the business does.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      style={{ padding: "clamp(5rem, 10vw, 9rem) clamp(1.25rem, 5vw, 3.5rem)", borderTop: "1px solid var(--line)", background: "#0c0c0c" }}
    >
      <SectionHeading
        index="(03)"
        eyebrow="How we work"
        title={<>A process built on <span className="text-gold-grad">clarity.</span></>}
        intro="No black boxes, no endless revisions. Four phases, clear deliverables, and a platform you understand at every step."
      />

      <div
        style={{
          marginTop: "clamp(3rem, 6vw, 5rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 0,
          borderTop: "1px solid var(--line)",
        }}
      >
        {steps.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.08}>
            <div
              style={{
                padding: "2.4rem clamp(1.25rem, 2vw, 2rem) 2.6rem 0",
                borderRight: "1px solid var(--line)",
                height: "100%",
              }}
            >
              <span className="font-display text-gold-grad" style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.04em" }}>{s.no}</span>
              <h3 className="font-display" style={{ marginTop: "1rem", fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--cream)" }}>{s.title}</h3>
              <p style={{ marginTop: "0.8rem", fontSize: "0.92rem", lineHeight: 1.65, color: "rgba(245,240,235,0.5)" }}>{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
