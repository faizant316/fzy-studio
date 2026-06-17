"use client";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

const letterV = {
  hidden: { y: "118%" },
  visible: { y: 0, transition: { duration: 1.0, ease } },
};

// Staggered mask-reveal of FZY. `outline` renders elegant stroked letters (used
// over the video hero); otherwise a filled wordmark with a slow sheen.
export default function Wordmark({ className, light = false, outline = false }: { className?: string; light?: boolean; outline?: boolean }) {
  const reduce = useReducedMotion();
  const letters = ["F", "Z", "Y"];

  const base = light ? "#ffffff" : "#0a0a0a";
  const sheen = light ? "#bdbdbd" : "#6a6a6a";

  const sizing: React.CSSProperties = {
    display: "inline-block",
    fontWeight: 600,
    letterSpacing: "-0.05em",
    lineHeight: 0.8,
    fontSize: "clamp(5rem, 16vw, 14rem)",
  };

  const outlineType: React.CSSProperties = {
    ...sizing,
    color: "transparent",
    WebkitTextFillColor: "transparent",
    WebkitTextStroke: `2px ${light ? "rgba(255,255,255,0.9)" : "rgba(10,10,10,0.85)"}`,
  };

  const fillType: React.CSSProperties = {
    ...sizing,
    backgroundImage: `linear-gradient(105deg, ${base} 0%, ${base} 40%, ${sheen} 50%, ${base} 60%, ${base} 100%)`,
    backgroundSize: "230% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    animation: "fzy-sheen 7s ease-in-out infinite",
  };

  const type = outline ? outlineType : fillType;

  if (reduce) {
    const staticStyle = outline ? outlineType : { ...sizing, color: base, WebkitTextFillColor: base };
    return (
      <div className={className} style={{ display: "flex", justifyContent: "center" }}>
        <span style={staticStyle}>FZY</span>
      </div>
    );
  }

  return (
    <motion.div className={className} variants={container} initial="hidden" animate="visible" style={{ display: "flex", justifyContent: "center" }}>
      {letters.map((l) => (
        <span key={l} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.14em" }}>
          <motion.span variants={letterV} style={type}>{l}</motion.span>
        </span>
      ))}
      <style>{`
        @keyframes fzy-sheen {
          0% { background-position: 135% 0; }
          55%, 100% { background-position: -35% 0; }
        }
      `}</style>
    </motion.div>
  );
}
