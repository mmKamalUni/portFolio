"use client";
import { useInView } from "react-intersection-observer";

type Options = {
  threshold?: number;
  once?: boolean;
  offsetY?: number;
  duration?: number;
};

export function useInViewMotion(options: Options = {}) {
  const { threshold = 0.2, once = true, offsetY = 24, duration = 0.8 } = options;
  const { ref, inView } = useInView({ threshold, triggerOnce: once });

  return {
    ref,
    initial: { opacity: 0, y: offsetY },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    whileInView: undefined as undefined | Record<string, unknown>,
    viewport: { once, amount: threshold },
    transition: { duration, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  } as const;
}
