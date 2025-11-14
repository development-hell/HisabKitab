import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 shadow-smooth bg-[rgb(var(--color-card))]">
      <h1 className="text-2xl font-bold">HisabKitab</h1>

      <div className="flex gap-6">
        <Link className="hover:text-blue-600 transition" to="#features">
          Features
        </Link>
        <Link className="hover:text-blue-600 transition" to="/login">
          Login
        </Link>
        <Link
          to="/register"
          className="btn btn-primary"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
