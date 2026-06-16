"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 2,
        transformOrigin: "0% 50%",
        scaleX,
        zIndex: 70,
        background: "linear-gradient(90deg, var(--gold-soft), var(--gold) 55%, var(--gold-deep))",
      }}
    />
  );
}
