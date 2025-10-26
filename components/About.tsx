"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInViewMotion } from "@/lib/hooks/useInViewMotion";
import LiquidContainer from "@/components/LiquidContainer";
import { objective } from "@/lib/data";

const TRAITS = [
  "Analytical",
  "Problem-Solving",
  "Leadership",
  "Communication",
  "Product Thinking",
] as const;

export default function About() {
  const motionProps = useInViewMotion({ threshold: 0.2, once: true, offsetY: 24, duration: 0.8 });

  return (
    <section id="about" className="py-20">
      <motion.div
        ref={motionProps.ref}
        initial={motionProps.initial}
        animate={motionProps.animate}
        transition={motionProps.transition}
        className="mx-auto w-full max-w-[1200px] px-4"
      >
        <LiquidContainer className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image (top on mobile) */}
        <div className="flex justify-center md:order-2">
          <Image
            src="/images/profile.png"
            alt="Profile photo of Malik Murtaza Kamal"
            width={200}
            height={200}
            className="h-[200px] w-[200px] rounded-full border-2 border-cyan object-cover shadow-[0_0_30px_rgba(0,229,255,0.5)]"
            loading="lazy"
          />
        </div>

        {/* Text */}
        <div className="md:order-1">
          <h2 className="text-3xl font-semibold">About</h2>
          <p className="mt-4 max-w-prose text-base leading-[1.5] text-lightGray text-center md:text-left">
            {objective}
          </p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-base md:text-left">
            {TRAITS.map((t) => (
              <li key={t} className="font-semibold text-lightGray">
                {t}
              </li>
            ))}
          </ul>
        </div>
        </LiquidContainer>
      </motion.div>
    </section>
  );
}
