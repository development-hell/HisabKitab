import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <nav className="bg-primary text-primary-foreground px-6 py-3 flex justify-between items-center shadow-smooth">
        <h1 className="text-xl font-bold">HisabKitab</h1>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="hover:opacity-80">Dashboard</Link>
          <Link to="/connections" className="hover:opacity-80">Connections</Link>
          <Link to="/profile" className="hover:opacity-80">Profile</Link>

          {user ? (
            <button
              onClick={logout}
              className="bg-surface text-surface-foreground px-3 py-1 rounded-md shadow-smooth hover:opacity-90"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:opacity-80">Login</Link>
          )}
        </div>
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="bg-surface text-muted border-t border-base text-center py-2 text-sm">
        © {new Date().getFullYear()} HisabKitab. All rights reserved.
      </footer>
    </div>
  );
}
