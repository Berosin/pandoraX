"use client";

import { Globe } from "./Globe";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface AuroraGlobeProps extends Partial<ArtifactConfigValues> {
  colorA?: string;
  colorB?: string;
  speed?: number;
}

export default function AuroraGlobe({
  colorA = "#3aa88c",
  colorB = "#7859c8",
  speed = 0.08,
}: AuroraGlobeProps) {
  return <Globe colorA={colorA} colorB={colorB} speed={Number(speed)} />;
}