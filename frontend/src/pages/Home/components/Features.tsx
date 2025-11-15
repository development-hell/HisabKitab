export default function Features() {
	return (
		<section id="features" className="py-20 px-6 bg-surface">
			<h3 className="text-3xl font-semibold text-center mb-12 text-surface-foreground">Why Choose HisabKitab?</h3>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				<div className="card">
					<h4 className="card-title-text">Track Expenses</h4>
					<p className="mt-3 text-sm">Quickly add, manage, and categorize expenses with zero hassle.</p>
				</div>

				<div className="card">
					<h4 className="card-title-text">User Connections</h4>
					<p className="mt-3 text-sm">Send, receive, accept, or reject balance requests between users.</p>
				</div>

				<div className="card">
					<h4 className="card-title-text">Smart Insights</h4>
					<p className="mt-3 text-sm">Get balance summaries and settlement suggestions instantly.</p>
				</div>
			</div>
		</section>
	);
}
