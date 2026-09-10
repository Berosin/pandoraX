export const site = {
  name: "PandoraX",
  tagline: "Open the extraordinary.",
  description:
    "A collection of interactive components, motion experiments, WebGL scenes and creative digital artifacts for the modern web.",
  url: "https://pandorax.dev",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Primary routes established in this phase. Future routes (favorites,
 * profile, submit, dashboard) are intentionally not linked yet. */
export const primaryNav: NavLink[] = [
  { label: "Artifacts", href: "/artifacts" },
  { label: "Collections", href: "/collections" },
  { label: "Playground", href: "/playground" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
];
