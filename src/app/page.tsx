import { Hero } from "@/components/marketing/Hero";
import { FeaturedArtifacts } from "@/components/marketing/FeaturedArtifacts";
import { Categories } from "@/components/marketing/Categories";
import { OpenTheBox } from "@/components/marketing/OpenTheBox";
import { WhyPandoraX } from "@/components/marketing/WhyPandoraX";
import { TechShowcase } from "@/components/marketing/TechShowcase";
import { FinalCta } from "@/components/marketing/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedArtifacts />
      <Categories />
      <OpenTheBox />
      <WhyPandoraX />
      <TechShowcase />
      <FinalCta />
    </>
  );
}