"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  title: string;
  description: string;
  bullets: readonly string[];
  imageSrc?: string;
};

export default function ProjectCard({ title, description, bullets, imageSrc = "/next.svg" }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="rounded-lg bg-darkGray/50 p-6 shadow-md transition-transform duration-300 hover:scale-105">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        aria-expanded={open}
      >
        <h3 className="font-serif text-[24px] font-semibold text-cyan">{title}</h3>
        <span className="ml-4 text-cyan">{open ? "−" : "+"}</span>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        style={{ overflow: "hidden" }}
        className="mt-4"
      >
        <div className="space-y-4">
          <div className="relative h-40 w-full overflow-hidden rounded-md bg-black/20">
            <Image
              src={imageSrc}
              alt={`${title} screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              priority={false}
            />
          </div>
          <p className="font-sans text-base text-white">{description}</p>
          <ul className="list-disc space-y-1 pl-5 font-sans text-base text-white/90">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
