import { Outlet } from "react-router-dom";
import Footer from "../pages/Home/components/Footer";
import Navbar from "../pages/Home/components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}