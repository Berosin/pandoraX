import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Docs" };

export default function DocsPage() {
  return (
    <ComingSoon
      title="Docs"
      description="Installation guides and API reference are on the way."
    />
  );
}
