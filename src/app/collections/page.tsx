import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <ComingSoon
      title="Collections"
      description="Curated groups of artifacts are on the way. For now, browse the full library."
    />
  );
}
