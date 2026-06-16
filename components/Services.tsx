"use client";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const services = [
  {
    no: "01",
    title: "Web Platforms",
    body: "Full-stack platforms built from scratch, not templates. Booking systems, client portals, and admin workspaces engineered to handle real volume.",
    points: ["Next.js & React", "Supabase / Postgres", "Authentication & roles"],
  },
  {
    no: "02",
    title: "Booking & Automation",
    body: "The operations layer that runs a business on autopilot. Calendars, payment tracking, and automated email so nothing slips through the cracks.",
    points: ["Real-time availability", "Payment & deposit tracking", "Automated confirmations"],
  },
  {
    no: "03",
    title: "Design & Brand",
    body: "Interfaces that look the part. Every screen designed mobile-first with the polish clients expect from a premium brand.",
    points: ["Mobile-first UI/UX", "Design systems", "Motion & interaction"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      style={{ padding: "clamp(5rem, 10vw, 9rem) clamp(1.25rem, 5vw, 3.5rem)", position: "relative" }}
    >
      <SectionHeading
        index="(01)"
        eyebrow="What we do"
        title={<>End to end, <span className="text-gold-grad serif-italic">under one roof.</span></>}
        intro="From the first wireframe to the live deployment, FZY owns the whole build. You work with one studio, not a chain of freelancers."
      />

      <div
        style={{
          marginTop: "clamp(3rem, 6vw, 5rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "clamp(1rem, 2vw, 1.5rem)",
        }}
      >
        {services.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.08}>
            <div
              className="glass"
              style={{
                position: "relative",
                height: "100%",
                padding: "2.2rem 2rem 2.4rem",
                borderRadius: 18,
                transition: "border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,166,107,0.4)"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 24px 60px -28px rgba(201,166,107,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span className="font-mono" style={{ fontSize: "0.72rem", color: "var(--gold)" }}>{s.no}</span>
              <h3
                className="font-display"
                style={{ marginTop: "1.4rem", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--cream)" }}
              >
                {s.title}
              </h3>
              <p style={{ marginTop: "0.9rem", fontSize: "0.95rem", lineHeight: 1.65, color: "rgba(245,240,235,0.5)" }}>
                {s.body}
              </p>
              <div style={{ marginTop: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {s.points.map((p) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
                    <span className="font-mono" style={{ fontSize: "0.78rem", letterSpacing: "0.03em", color: "rgba(245,240,235,0.6)" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
