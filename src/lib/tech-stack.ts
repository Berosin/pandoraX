export interface TechGroup {
  label: string;
  items: string[];
}

export const techGroups: TechGroup[] = [
  {
    label: "Foundation",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Animation",
    items: ["Motion", "GSAP"],
  },
  {
    label: "3D & WebGL",
    items: ["Three.js", "React Three Fiber", "WebGL", "GLSL"],
  },
];