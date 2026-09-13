import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <ComingSoon
      title="Playground"
      description="A dedicated space to customize artifacts and export configurations is coming in a later phase."
    />
  );
}
