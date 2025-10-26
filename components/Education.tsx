"use client";
import React from "react";
import { motion } from "framer-motion";
import { education } from "@/lib/data";
import LiquidContainer from "@/components/LiquidContainer";

export default function Education() {
  return (
    <section id="education" className="py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <LiquidContainer>
          <h2 className="mb-6 font-serif text-[24px] font-bold text-cyan">Education</h2>
          <div className="relative">
          {/* Vertical timeline line */}
          <div className="pointer-events-none absolute left-4 top-0 h-full w-1 bg-cyan/70" />

          <ul className="relative space-y-6 pl-12">
            {education.map((item) => (
              <li key={`${item.institution}-${item.degree}`} className="relative">
                {/* Node dot */}
                <div className="absolute left-3 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]" />

                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="font-sans text-base font-semibold text-white">
                    {item.institution}
                  </div>
                  <div className="font-sans text-base text-lightGray">{item.degree}</div>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
        </LiquidContainer>
      </div>
    </section>
  );
}
