"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { getRandomArtifact } from "@/lib/registry";
import { cn } from "@/lib/cn";

export function OpenTheBoxButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);

  function openTheBox() {
    const artifact = getRandomArtifact();
    if (!artifact) return;
    setIsOpening(true);
    router.push(`/artifacts/${artifact.slug}`);
  }

  return (
    <Button
      variant="secondary"
      onClick={openTheBox}
      disabled={isOpening}
      className={cn("transition-opacity", isOpening && "opacity-60", className)}
    >
      Open the Box
    </Button>
  );
}
