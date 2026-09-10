import { Wordmark } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { OpenTheBoxButton } from "@/components/artifact/OpenTheBoxButton";
import { primaryNav } from "@/lib/site";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-cream-dim transition-colors hover:text-cream"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <OpenTheBoxButton />
      </Container>
    </header>
  );
}
