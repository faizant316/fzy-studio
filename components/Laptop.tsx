"use client";
import { useEffect, useRef, useState } from "react";

/* A realistic laptop (thin aluminium edge, black glass bezel, camera notch,
   hinge, base with a thumb cut-out and a soft contact shadow), built in CSS.
   The screen renders a fixed 1280 × 800 canvas scaled to fit, so whatever
   plays on it stays pixel-true at any size. */

export const CANVAS_W = 1280;
export const CANVAS_H = 800;

export default function Laptop({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / CANVAS_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`lt ${className}`}>
      <div className="lt-lid">
        <div className="lt-screen" ref={screenRef}>
          <div className="lt-canvas" style={{ transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}>
            {children}
          </div>
          <span className="lt-glare" aria-hidden />
        </div>
        <span className="lt-notch" aria-hidden><i /></span>
      </div>
      <div className="lt-hinge" aria-hidden />
      <div className="lt-base" aria-hidden><i /></div>
      <div className="lt-shadow" aria-hidden />
      <style dangerouslySetInnerHTML={{ __html: LAPTOP_CSS }} />
    </div>
  );
}

const LAPTOP_CSS = `
.lt { position: relative; width: 100%; padding-bottom: 2.4%; }
.lt-lid {
  position: relative; width: 84%; margin: 0 auto;
  padding: 1.5% 1.5% 2.1%;
  border-radius: 2.4% / 3.6%;
  background: #0a0a0b;
  box-shadow:
    0 0 0 1.5px #b9b9bd,
    0 0 0 2.5px #8f8f94,
    inset 0 0 0 1px rgba(255,255,255,0.06),
    0 30px 60px -36px rgba(20,20,20,0.55);
}
.lt-screen {
  position: relative; width: 100%; aspect-ratio: ${CANVAS_W} / ${CANVAS_H};
  overflow: hidden; border-radius: 0.5% / 0.8%; background: #000; isolation: isolate;
}
.lt-canvas {
  position: absolute; left: 0; top: 0; width: ${CANVAS_W}px; height: ${CANVAS_H}px;
  transform-origin: 0 0; overflow: hidden; transition: opacity 0.3s ease;
}
.lt-glare {
  position: absolute; inset: 0; z-index: 60; pointer-events: none;
  background: linear-gradient(112deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0) 46%);
}
.lt-notch {
  position: absolute; z-index: 61; top: 0; left: 50%; transform: translateX(-50%);
  width: 8.5%; height: 3.4%; border-radius: 0 0 9px 9px; background: #0a0a0b;
  display: flex; align-items: center; justify-content: center;
}
.lt-notch i { width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #34405e, #0b0d14 70%); display: block; }
.lt-hinge {
  position: relative; width: 84%; height: clamp(4px, 0.55vw, 8px); margin: 0 auto;
  background: linear-gradient(180deg, #3a3a3d 0%, #1b1b1d 55%, #4a4a4e 100%);
  border-radius: 0 0 3px 3px;
}
.lt-base {
  position: relative; width: 100%; height: clamp(9px, 1.25vw, 17px); margin-top: -1px;
  border-radius: 0 0 18px 18px / 0 0 100% 100%;
  background: linear-gradient(180deg, #f4f4f5 0%, #d9d9dc 30%, #b4b4b9 72%, #8e8e93 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 0 rgba(0,0,0,0.15);
}
.lt-base i {
  position: absolute; left: 50%; top: 0; transform: translateX(-50%);
  width: 15%; height: 48%; border-radius: 0 0 12px 12px;
  background: linear-gradient(180deg, #a7a7ac, #cfcfd3);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.25);
}
.lt-shadow {
  position: absolute; left: 4%; right: 4%; bottom: 0; height: 2.4%;
  background: radial-gradient(50% 100% at 50% 0%, rgba(20,20,20,0.32), rgba(20,20,20,0) 70%);
  filter: blur(4px);
}
`;
