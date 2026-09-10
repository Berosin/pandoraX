import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/pandorax-mark.png"
      alt=""
      width={size}
      height={size}
      className={cn("rounded-[6px]", className)}
      priority
    />
  );
}

export function Wordmark({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 text-lg font-semibold tracking-tight text-cream",
        className
      )}
    >
      <Mark size={26} />
      Pandora
      <span className="text-bronze">X</span>
    </Link>
  );
}
