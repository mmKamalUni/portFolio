"use client";
import { LazyMotion, domAnimation } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
