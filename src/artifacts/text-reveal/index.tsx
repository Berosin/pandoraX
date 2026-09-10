"use client";

import { motion } from "motion/react";
import { splitToCharacters } from "./splitText";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface TextRevealProps extends Partial<ArtifactConfigValues> {
  text?: string;
  color?: string;
  stagger?: number;
}

export default function TextReveal({
  text = "PandoraX",
  color = "#f3e1c3",
  stagger = 0.04,
}: TextRevealProps) {
  const characters = splitToCharacters(text);

  return (
    <p
      className="text-4xl font-semibold tracking-tight"
      style={{ color }}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          aria-hidden
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * Number(stagger),
            ease: "easeOut",
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </p>
  );
}
