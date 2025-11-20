import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Connections from "./pages/Connections";
import ContactsPage from "./pages/Contacts/ContactsPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/Home/HomePage";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Auth/Register";
import Settings from "./pages/Settings";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route element={<MainLayout />}>
						<Route path="/home" element={<HomePage />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						{/* <Route path="/about" element={<AboutPage />} /> */}
					</Route>
					{/* Protected Routes */}
					<Route element={<ProtectedLayout />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/connections" element={<Connections />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/contacts" element={<ContactsPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>,
);
