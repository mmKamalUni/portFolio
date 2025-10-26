"use client";
import React from "react";
import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import SkillCard from "@/components/SkillCard";
import LiquidContainer from "@/components/LiquidContainer";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function Skills() {
  const entries = Object.entries(skills);

  return (
    <section id="skills" className="py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <LiquidContainer>
          <h2 className="mb-6 font-serif text-[24px] font-bold text-cyan">Skills</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
          >
            {entries.map(([category, items]) => (
              <SkillCard key={category} title={toTitle(category)} items={items as readonly string[]} />
            ))}
          </motion.div>
        </LiquidContainer>
      </div>
    </section>
  );
}

function toTitle(key: string) {
  // Convert camelCase or mixed keys to Title Case (e.g., productThinking -> Product Thinking)
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}
