import CTA from "./components/CTA";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
			<Navbar />
			<Hero />
			<Features />
			<CTA />
			<Footer />
		</div>
	);
}
