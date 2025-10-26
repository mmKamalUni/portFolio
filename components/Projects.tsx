"use client";
import React from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import LiquidContainer from "@/components/LiquidContainer";

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[1200px] px-4"
      >
        <LiquidContainer>
          <h2 className="mb-6 font-serif text-[24px] font-bold text-cyan">Projects</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                description={p.description}
                bullets={p.bullets as readonly string[]}
              />
            ))}
          </div>
        </LiquidContainer>
      </motion.div>
    </section>
  );
}
