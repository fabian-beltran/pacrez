"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { registerSchema } from "@/lib/schemas/auth";
import { Role } from "@/generated/prisma/enums";

export const loginAction = async (formData: { email: string; password: string }) => {
	const loginSchema = z.object({
		email: z.email("Invalid email address"),
		password: z.string().min(1, "Password is required"),
	});
	const parsed = loginSchema.parse(formData);

	const user = await prisma.user.findUnique({
		where: { email: parsed.email },
	});
	if (!user) throw new Error("Invalid email or password");

	const isValid = await bcrypt.compare(parsed.password, user.passwordHash);
	if (!isValid) throw new Error("Invalid email or password");

	const token = sign({ userId: user.id }, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});

	const cookieStore = await cookies();
	cookieStore.set({
		name: "auth_token",
		value: token,
		httpOnly: true,
		path: "/",
		maxAge: 60 * 60 * 24 * 7,
	});

	return { success: true, userId: user.id };
};

export const registerAction = async (formData: {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}) => {
	const parsed = registerSchema.parse(formData);

	const existingUser = await prisma.user.findUnique({
		where: { email: parsed.email },
	});

	if (existingUser) throw new Error("Email is already registered");

	let role: Role;
	if (parsed.email.endsWith("u.pacific.edu")) {
		role = "STUDENT";
	} else if (parsed.email.endsWith("pacific.edu")) {
		role = "FACULTY";
	} else {
		throw new Error("Invalid email domain");
	}

	const passwordHash = await bcrypt.hash(parsed.password, 10);

	const user = await prisma.user.create({
		data: {
			firstName: parsed.firstName,
			lastName: parsed.lastName,
			email: parsed.email,
			role,
			passwordHash,
		},
	});

	const token = sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

	const cookieStore = await cookies();
	cookieStore.set({
		name: "auth_token",
		value: token,
		httpOnly: true,
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	});

	return { success: true, userId: user.id };
};

export const getCurrentUser = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;
	if (!token) return null;

	try {
		const payload = verify(token, process.env.JWT_SECRET!) as { userId: string };
		const user = await prisma.user.findUnique({ where: { id: payload.userId } });
		return user;
	} catch {
		return null;
	}
};

export const requireUser = async () => {
	const user = await getCurrentUser();
	if (!user) throw new Error("Not logged in.");

	return user;
};

export const logoutAction = async () => {
	const cookieStore = await cookies();

	cookieStore.delete({ name: "auth_token", path: "/" });

	return { success: true };
};
