import CTA from "./components/CTA";
import Features from "./components/Features";
import Hero from "./components/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}