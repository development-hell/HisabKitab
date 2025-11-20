import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../lib/axios";

export default function Register() {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<any>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});

		if (formData.password !== formData.confirmPassword) {
			setErrors({ form: "Passwords do not match." });
			setLoading(false);
			return;
		}

		try {
			await api.post("users/", {
				first_name: formData.first_name,
				last_name: formData.last_name,
				username: formData.username,
				email: formData.email,
				password: formData.password,
			});
			// On success, redirect to login with a success message
			navigate("/login?status=success");
		} catch (err: any) {
			console.error(err);
			if (err.response?.data) {
				setErrors(err.response.data);
			} else {
				setErrors({ form: "An unexpected error occurred. Please try again." });
			}
		} finally {
			setLoading(false);
		}
	};

	if (user) {
		return <Navigate to="/contacts" replace />;
	}

	return (
		<div className="flex flex-col items-center justify-center h-full py-12 px-4 sm:px-6 lg:px-8">
			<div className="card w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-muted">
						Already have an account?{" "}
						<Link to="/login" className="font-medium text-primary hover:text-primary/80">
							Sign in
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{errors.form && <p className="text-danger text-sm text-center">{errors.form}</p>}

					<div className="space-y-4">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<label htmlFor="first_name" className="block text-sm font-medium text-foreground mb-1">
									First Name
								</label>
								<input
									id="first_name"
									required
									name="first_name"
									value={formData.first_name}
									onChange={handleChange}
									className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
									type="text"
								/>
								{errors.first_name && <p className="text-danger text-xs mt-1">{errors.first_name}</p>}
							</div>
							<div className="flex-1">
								<label htmlFor="last_name" className="block text-sm font-medium text-foreground mb-1">
									Last Name
								</label>
								<input
									id="last_name"
									required
									name="last_name"
									value={formData.last_name}
									onChange={handleChange}
									className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
									type="text"
								/>
								{errors.last_name && <p className="text-danger text-xs mt-1">{errors.last_name}</p>}
							</div>
						</div>

						<div>
							<label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
								Username
							</label>
							<input
								id="username"
								required
								name="username"
								value={formData.username}
								onChange={handleChange}
								className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
								type="text"
							/>
							{errors.username && <p className="text-danger text-xs mt-1">{errors.username}</p>}
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
								Email
							</label>
							<input
								id="email"
								required
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
								type="email"
								autoComplete="email"
							/>
							{errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
								Password
							</label>
							<input
								id="password"
								type="password"
								required
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
								autoComplete="new-password"
							/>
							{errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								required
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className="appearance-none relative block w-full px-3 py-2 border border-border placeholder-muted text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-background"
								autoComplete="new-password"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Creating Account..." : "Create Account"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
