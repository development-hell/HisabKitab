import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const useAuth = () => {
	const context = useContext(AuthContext);

	// The production-safe check is the most important part.
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context!;
};
