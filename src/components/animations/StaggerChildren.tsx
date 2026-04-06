"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, Children } from "react";

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  direction?: "up" | "left" | "none";
  distance?: number;
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  direction = "up",
  distance = 20,
  className = "",
}: StaggerChildrenProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...(direction === "up" ? { y: distance } : {}),
      ...(direction === "left" ? { x: distance } : {}),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
