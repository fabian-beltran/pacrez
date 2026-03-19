"use client";

import { createContext, useContext } from "react";
import { User } from "@/generated/prisma/browser";

const AuthContext = createContext<User | null>(null);

export function AuthProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within AuthProvider");
	}

	return context;
}
