import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Logo";
import { primaryNav, site } from "@/lib/site";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-sm text-sm text-muted">{site.description}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
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
      </Container>

      <Container className="border-t border-line py-6 text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All source is provided
        under each artifact&apos;s license.
      </Container>
    </footer>
  );
}
