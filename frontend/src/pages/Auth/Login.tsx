import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
	const { login, user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const params = new URLSearchParams(location.search);
	const next = (params.get("next") || "/dashboard") as string;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		if (params.get("status") === "success") {
			setMessage("✅ Registration successful! Please sign in.");
		}
	}, [location.search]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			await login(email, password);
			navigate(next, { replace: true });
		} catch (err: any) {
			console.error(err);
			const message = err?.response?.detail || "Invalid credentials";
			setMessage(String(message));
		} finally {
			setLoading(false);
		}
	};

	if (user) {
		return <Navigate to={"/dashboard"} />;
	}

	return (
		<div className="flex flex-col items-center justify-center h-full py-12 px-4 sm:px-6 lg:px-8">
			<div className="card w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-muted">
						Or{" "}
						<Link to="/register" className="font-medium text-primary hover:text-primary/80">
							create a new account
						</Link>
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<div className="mb-4">
							<label htmlFor="email-address" className="block text-sm font-medium text-foreground mb-1">
								Email address
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing in..." : "Sign in"}
						</button>
					</div>

					{message && (
						<div className={`text-center text-sm ${message.startsWith("✅") ? "text-accent" : "text-danger"}`}>
							{message}
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
