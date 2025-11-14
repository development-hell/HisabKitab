// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		try {
			await login(email, password);
			navigate(next, { replace: true });
		} catch (err: any) {
			console.error(err);
			const message =
				err?.response?.data ||
				"Invalid credentials or server error";
			setMessage(String(message));
		} finally {
			setLoading(false);
		}
	};
	
	if (user) {return <Navigate to={"/dashboard"} />;}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm p-6 bg-surface rounded"
			>
				<h1 className="text-xl font-semibold mb-4">Sign in</h1>

				<label className="block text-sm">Email</label>
				<input
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full mb-3"
					type="email"
					autoComplete="email"
				/>

				<label className="block text-sm">Password</label>
				<input
					type="password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full mb-4"
					autoComplete="current-password"
				/>

				<button disabled={loading} className="btn btn-primary w-full">
					{loading ? "Signing in..." : "Sign in"}
				</button>

				{message && <p className="text-danger mt-3">{message}</p>}
			</form>
		</div>
	);
}
