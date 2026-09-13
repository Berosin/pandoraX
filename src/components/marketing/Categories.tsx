import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ARTIFACT_CATEGORIES } from "@/types/artifact";
import { categoryMeta } from "@/lib/category-meta";
import { getArtifactsByCategory } from "@/lib/registry";
import { cn } from "@/lib/cn";

export function Categories() {
  const availableCount = ARTIFACT_CATEGORIES.filter(
    (category) => getArtifactsByCategory(category).length > 0
  ).length;

  return (
    <Section divider>
      <Container>
        <p className="text-label text-accent">Categories</p>
        <h2 className="text-h2 mt-2 text-foreground">Explore by category</h2>
        <p className="mt-3 max-w-lg text-body text-muted">
          {ARTIFACT_CATEGORIES.length} kinds of interactive work.{" "}
          {availableCount} {availableCount === 1 ? "is" : "are"} open right
          now — the rest are being built out.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ARTIFACT_CATEGORIES.map((category) => {
            const { icon: Icon, description } = categoryMeta[category];
            const count = getArtifactsByCategory(category).length;
            const available = count > 0;

            const tile = (
              <div
                className={cn(
                  "group flex h-full flex-col gap-3 rounded-lg border border-border p-5 transition-colors",
                  available
                    ? "hover:border-accent"
                    : "opacity-50"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "text-muted transition-colors",
                    available && "group-hover:text-accent"
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {category}
                  </p>
                  <p className="mt-1 text-xs text-muted">{description}</p>
                </div>
                <p className="mt-auto text-xs text-muted">
                  {available
                    ? `${count} artifact${count === 1 ? "" : "s"}`
                    : "Coming soon"}
                </p>
              </div>
            );

            return available ? (
              <Link
                key={category}
                href={`/artifacts?category=${encodeURIComponent(category)}`}
              >
                {tile}
              </Link>
            ) : (
              <div key={category} aria-disabled>
                {tile}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}