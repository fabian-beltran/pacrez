import * as z from "zod";

// Registration schema
export const registerSchemaClient = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.email("Invalid email address").regex(/@.*\.?pacific\.edu$/, "Must use your Pacific email"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export const registerSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.email("Invalid email address").regex(/@.*\.?pacific\.edu$/, "Must use your Pacific email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login schema
export const loginSchema = z.object({
	email: z.email("Invalid email address").regex(/@.*\.?pacific\.edu$/, "Must use your Pacific email"),
	password: z.string().min(1, "Password is required"),
});
