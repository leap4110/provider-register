"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedHeroProps {
  children: ReactNode;
}

export function AnimatedHero({ children }: AnimatedHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-center md:py-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Find the right NDIS service for you
          </h1>
          <p className="mt-4 text-lg text-blue-100 md:text-xl">
            With ratings &amp; reviews you can trust
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-center md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.h1
          className="text-3xl font-bold tracking-tight text-white md:text-5xl"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          Find the right NDIS service for you
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-blue-100 md:text-xl"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          With ratings &amp; reviews you can trust
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
