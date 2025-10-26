"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

type Props = React.PropsWithChildren<{
  className?: string;
  noPadding?: boolean; // for Hero full-bleed
}>;

type Ripple = {
  id: number;
  x: number;
  y: number;
  kind: "click" | "hover";
};

export default function LiquidContainer({ className, children, noPadding }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const lastHoverSpawnRef = React.useRef(0);
  const idRef = React.useRef(0);

  const addRipple = (e: React.MouseEvent<HTMLDivElement>, kind: Ripple["kind"]) => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++idRef.current;
    setRipples((prev) => [...prev, { id, x, y, kind }]);
    // Auto-remove after animation
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, kind === "click" ? 650 : 450);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (now - lastHoverSpawnRef.current < 90) return; // throttle ~11 fps
    lastHoverSpawnRef.current = now;
    addRipple(e, "hover");
  };

  return (
    <motion.div
      ref={containerRef}
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 opacity-90",
        noPadding ? "p-0" : "p-6",
        className
      )}
      initial={{ scale: 1 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={(e) => addRipple(e, "click")}
      onMouseMove={onMouseMove}
      aria-hidden={false}
    >
      {/* Ripples */}
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0">
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              className="absolute rounded-full"
              style={{
                top: r.y - 50,
                left: r.x - 50,
                width: r.kind === "click" ? 100 : 80,
                height: r.kind === "click" ? 100 : 80,
                background:
                  "radial-gradient(circle, rgba(0,229,255,0.35) 0%, rgba(138,43,226,0.0) 70%)",
                filter: "blur(0.5px)",
              }}
              initial={{ opacity: 0.25, scale: 0 }}
              animate={{ opacity: 0, scale: r.kind === "click" ? 2 : 1.5 }}
              transition={{ duration: r.kind === "click" ? 0.6 : 0.4, ease: "easeOut" }}
            />)
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}
