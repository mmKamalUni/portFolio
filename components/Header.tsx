"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const NAV_ITEMS = ["Hero", "About", "Skills", "Projects", "Education", "Contact"] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const navRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Observe sections to update active indicator
  useEffect(() => {
    const sections = NAV_ITEMS.map((l) => document.getElementById(l.toLowerCase())).filter(
      (n): n is HTMLElement => !!n
    );
    if (sections.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = NAV_ITEMS.findIndex((l) => l.toLowerCase() === visible.target.id);
          if (idx !== -1) setActiveIdx(idx);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Position indicator to hovered or active item
  useEffect(() => {
    const targetIdx = hoverIdx ?? activeIdx;
    const target = navRefs.current[targetIdx];
    const indicator = indicatorRef.current;
    const container = navContainerRef.current;
    if (!target || !indicator || !container) return;
    const tRect = target.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    const left = tRect.left - cRect.left;
    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${tRect.width}px`;
  }, [activeIdx, hoverIdx]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        scrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="#hero" className="select-none font-serif text-[24px] font-bold leading-none">
          MMK
        </a>

        {/* Desktop nav with liquid indicator */}
        <div className="relative hidden md:block" ref={navContainerRef}>
          <nav className="flex items-center gap-4">
            {NAV_ITEMS.map((label, idx) => {
              const id = label.toLowerCase();
              return (
                <motion.button
                  key={label}
                  ref={(el) => {navRefs.current[idx] = el}}
                  onMouseEnter={() => setHoverIdx(idx)}
                  onMouseLeave={() => setHoverIdx(null)}
                  onClick={() => handleNavClick(id)}
                  whileHover={{ rotateX: 5 }}
                  transition={{ duration: 0.2 }}
                  className={clsx(
                    "relative rounded-full px-4 py-2 text-cyan transition-colors duration-200 hover:text-violet",
                    idx === activeIdx && "text-violet"
                  )}
                  style={{ transformPerspective: 600 }}
                >
                  {/* Bubble background effect */}
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-full"
                    initial={false}
                    animate={{ scale: hoverIdx === idx ? 1 : 0.001, opacity: hoverIdx === idx ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), rgba(255,255,255,0))",
                    }}
                  />
                  {label}
                </motion.button>
              );
            })}
          </nav>
          {/* Liquid active/hover indicator bar */}
          <motion.div
            ref={indicatorRef}
            className="pointer-events-none absolute -bottom-1 h-[3px] w-0 rounded-full backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,229,255,1) 0%, rgba(138,43,226,1) 100%)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>

        {/* Mobile toggle */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded md:hidden"
        >
          {open ? (
            <XMarkIcon className="h-7 w-7 text-cyan" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-cyan" />
          )}
        </button>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-64 bg-black/70 backdrop-blur-md p-6 md:hidden"
          >
            <nav className="mt-12 flex flex-col gap-4">
              {NAV_ITEMS.map((label) => {
                const id = label.toLowerCase();
                return (
                  <button
                    key={label}
                    onClick={() => handleNavClick(id)}
                    className="text-left text-lg text-cyan transition-colors duration-200 hover:text-violet"
                  >
                    {label}
                  </button>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}
