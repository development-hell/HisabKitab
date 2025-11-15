import { Link } from "react-router-dom";

export default function Hero() {
	return (
		<section className="text-center py-20 px-6">
			<h2 className="text-4xl font-bold mb-4">Smart Expense Tracking Made Simple</h2>

			<p className="text-lg text-muted max-w-2xl mx-auto mb-8">
				Track expenses, manage user connections, settle balances with ease — all in one powerful dashboard.
			</p>

			<Link to="/register" className="btn btn-primary text-lg m-0">
				Start Now – It's Free
			</Link>
		</section>
	);
}
