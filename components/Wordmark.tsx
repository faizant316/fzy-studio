"use client";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.35 } },
};

const letterV = {
  hidden: { y: "120%" },
  visible: { y: 0, transition: { duration: 0.95, ease } },
};

const floatV = {
  animate: { y: [0, -10, 0], transition: { duration: 7, ease: "easeInOut" as const, repeat: Infinity } },
};

// Adapted from a 21st.dev Magic generation: staggered mask-reveal of the FZY
// letters with a gentle continuous float. Tuned to the minimal white system.
export default function Wordmark({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const letters = ["F", "Z", "Y"];

  const type: React.CSSProperties = {
    display: "inline-block",
    fontWeight: 600,
    letterSpacing: "-0.05em",
    lineHeight: 0.8,
    fontSize: "clamp(5rem, 17vw, 15rem)",
    color: "var(--ink)",
  };

  if (reduce) {
    return (
      <div className={className} style={{ display: "flex", justifyContent: "center" }}>
        <span style={type}>FZY</span>
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={floatV}
      animate="animate"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <motion.div variants={container} initial="hidden" animate="visible" style={{ display: "flex" }}>
        {letters.map((l) => (
          <span key={l} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em" }}>
            <motion.span variants={letterV} style={type}>{l}</motion.span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
