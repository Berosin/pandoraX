import type { ArtifactCategory } from "@/types/artifact";
import {
  Waves,
  Box,
  Layers,
  Sparkles,
  MousePointer2,
  ScrollText,
  Type,
  Grid2x2,
  Hand,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export interface CategoryMeta {
  icon: LucideIcon;
  description: string;
}

export const categoryMeta: Record<ArtifactCategory, CategoryMeta> = {
  Motion: {
    icon: Waves,
    description: "Fluid, physics-driven animation.",
  },
  "3D": {
    icon: Box,
    description: "Three.js and React Three Fiber scenes.",
  },
  WebGL: {
    icon: Layers,
    description: "Raw shader-driven graphics.",
  },
  Shaders: {
    icon: Sparkles,
    description: "GLSL fragment and vertex work.",
  },
  Cursor: {
    icon: MousePointer2,
    description: "Custom pointer interactions.",
  },
  Scroll: {
    icon: ScrollText,
    description: "Scroll-linked and scroll-triggered effects.",
  },
  Text: {
    icon: Type,
    description: "Kinetic and generative typography.",
  },
  Backgrounds: {
    icon: Grid2x2,
    description: "Ambient, generative backdrops.",
  },
  Interactions: {
    icon: Hand,
    description: "Hover, drag and gesture-driven UI.",
  },
  Experimental: {
    icon: FlaskConical,
    description: "Unclassified, boundary-pushing work.",
  },
};