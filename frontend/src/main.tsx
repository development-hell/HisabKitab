import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Connections from "./pages/Connections";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/Home/HomePage";
import Login from "./pages/Login";
import PayeesPage from "./pages/Payees/PayeesPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					{/* Protected Routes */}
					<Route element={<ProtectedLayout />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/connections" element={<Connections />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/payees" element={<PayeesPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>,
);
