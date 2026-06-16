"use client";

const items = [
  "Booking Platforms",
  "Client Dashboards",
  "Payment Tracking",
  "Automated Email",
  "Admin Workspaces",
  "Real-time Data",
  "Mobile-first Design",
  "API Integrations",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div
      className="marquee-host no-scrollbar"
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        padding: "1.6rem 0",
        background: "#0c0c0c",
      }}
    >
      <div className="marquee-track" style={{ display: "flex", width: "max-content", gap: "3.5rem" }}>
        {row.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "3.5rem", flexShrink: 0 }}>
            <span
              className="font-display"
              style={{
                fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "rgba(245,240,235,0.42)",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
            <span className="slow-spin" style={{ color: "var(--gold)", fontSize: "0.9rem", flexShrink: 0 }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
