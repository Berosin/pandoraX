import { Wordmark } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { OpenTheBoxButton } from "@/components/artifact/OpenTheBoxButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { primaryNav } from "@/lib/site";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-dim transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <OpenTheBoxButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}