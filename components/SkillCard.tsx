"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";

type Props = {
  title: string;
  items: readonly string[];
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

export default function SkillCard({ title, items }: Props) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-lg bg-darkGray/50 p-6 shadow-md transition-transform duration-300 hover:-translate-y-[5px]"
    >
      <h3 className="font-serif text-[24px] font-semibold text-cyan">{title}</h3>
      <ul className="mt-4 list-disc space-y-1 pl-5 font-sans text-base text-white">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
}
