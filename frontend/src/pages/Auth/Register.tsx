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
		<div className="flex items-center justify-center py-12 px-4">
			<form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-surface rounded-xl shadow-smooth space-y-4">
				<h1 className="text-2xl font-semibold mb-4 text-center">Create Your Account</h1>

				{errors.form && <p className="text-danger text-sm text-center">{errors.form}</p>}

				<div className="flex flex-col md:flex-row gap-4">
					<div className="flex-1">
						<label htmlFor="first_name" className="block text-sm">
							First Name
						</label>
						<input id="first_name" required name="first_name" value={formData.first_name} onChange={handleChange} className="w-full mb-1" type="text" />
						{errors.first_name && <p className="text-danger text-xs">{errors.first_name}</p>}
					</div>
					<div className="flex-1">
						<label htmlFor="last_name" className="block text-sm">
							Last Name
						</label>
						<input id="last_name" required name="last_name" value={formData.last_name} onChange={handleChange} className="w-full mb-1" type="text" />
						{errors.last_name && <p className="text-danger text-xs">{errors.last_name}</p>}
					</div>
				</div>

				<div>
					<label htmlFor="username" className="block text-sm">
						Username
					</label>
					<input id="username" required name="username" value={formData.username} onChange={handleChange} className="w-full mb-1" type="text" />
					{errors.username && <p className="text-danger text-xs">{errors.username}</p>}
				</div>

				<div>
					<label htmlFor="email" className="block text-sm">
						Email
					</label>
					<input id="email" required name="email" value={formData.email} onChange={handleChange} className="w-full mb-1" type="email" autoComplete="email" />
					{errors.email && <p className="text-danger text-xs">{errors.email}</p>}
				</div>

				<div>
					<label htmlFor="password" className="block text-sm">
						Password
					</label>
					<input
						id="password"
						type="password"
						required
						name="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full mb-1"
						autoComplete="new-password"
					/>
					{errors.password && <p className="text-danger text-xs">{errors.password}</p>}
				</div>

				<div>
					<label htmlFor="confirmPassword" className="block text-sm">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						required
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						className="w-full mb-1"
						autoComplete="new-password"
					/>
				</div>

				<button disabled={loading} className="btn btn-primary w-full mt-4">
					{loading ? "Creating Account..." : "Create Account"}
				</button>

				<p className="text-sm text-center text-muted">
					Already have an account?{" "}
					<Link to="/login" className="font-medium text-primary hover:underline">
						Sign in
					</Link>
				</p>
			</form>
		</div>
	);
}
