"use client";
import React, { useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { personalDetails } from "@/lib/data";
import LiquidContainer from "@/components/LiquidContainer";

export default function Hero() {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  React.useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } });
    }
  }, [inView, controls]);

  const links = useMemo(() => {
    const locationQuery = encodeURIComponent(personalDetails.location);
    const tel = `tel:${personalDetails.phone.replace(/\s+/g, "")}`;
    const mail = `mailto:${personalDetails.email}`;
    return {
      location: `https://www.google.com/maps/search/?api=1&query=${locationQuery}`,
      phone: tel,
      email: mail,
      linkedin: personalDetails.linkedin,
    } as const;
  }, []);

  return (
    <section id="hero" className="flex min-h-screen items-center justify-center">
      <LiquidContainer className="w-full max-w-[1200px] mx-auto max-h-screen">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="mx-auto w-full max-w-[1200px] px-4 text-center"
        >
        <h1 className={clsx("font-serif font-bold text-white leading-tight", "text-[48px] sm:text-[96px]")}> 
          Malik Murtaza Kamal
        </h1>
        <h2 className="mt-4 font-sans text-[32px] text-lightGray">
          Software Engineer Transitioning to Product Manager
        </h2>

        <div className="mt-8 flex items-center justify-center gap-6">
          <a
            href={links.location}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan transition-colors duration-300 hover:text-violet"
            aria-label="Open location in Google Maps"
          >
            <MapPinIcon className="h-6 w-6" />
          </a>
          <a
            href={links.phone}
            className="text-cyan transition-colors duration-300 hover:text-violet"
            aria-label="Call phone number"
          >
            <PhoneIcon className="h-6 w-6" />
          </a>
          <a
            href={links.email}
            className="text-cyan transition-colors duration-300 hover:text-violet"
            aria-label="Send email"
          >
            <EnvelopeIcon className="h-6 w-6" />
          </a>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan transition-colors duration-300 hover:text-violet"
            aria-label="LinkedIn profile"
          >
            {/* Simple LinkedIn glyph */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.83v2h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.81 2.67 4.81 6.14V23h-4v-6.52c0-1.56-.03-3.56-2.17-3.56-2.17 0-2.5 1.69-2.5 3.44V23h-4V8.5z" />
            </svg>
          </a>
        </div>

        <div className="mt-16 flex justify-center">
          <a href="#about" aria-label="Scroll to About">
            <ChevronDownIcon className="h-8 w-8 animate-bounce text-cyan" />
          </a>
        </div>
        </motion.div>
      </LiquidContainer>
    </section>
  );
}
