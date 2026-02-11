"use client";
import React from "react";
import { useForm } from "@mantine/form";
import { Button, Center, Group, PasswordInput, Stack, TextInput, Title, Text, UnstyledButton } from "@mantine/core";
import * as z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import Link from "next/link";

const registerSchema = z
	.object({
		firstName: z.string(),
		lastName: z.string(),
		email: z.email("Invalid email address").regex(/@.*\.?pacific\.edu$/, "Must use your Pacific email"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"], // show error under confirm field
	});

const RegisterPage = () => {
	const form = useForm({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validate: zod4Resolver(registerSchema),
	});

	const handleSubmit = (values: typeof form.values) => {
		console.log("Login values:", values);
	};

	return (
		<Center>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack gap="xs" w={300}>
					<Title ta="center">Register</Title>
					<Group grow>
						<TextInput label="First Name" {...form.getInputProps("firstName")} />
						<TextInput label="Last Name" {...form.getInputProps("lastName")} />
					</Group>
					<TextInput label="Email" {...form.getInputProps("email")} />
					<PasswordInput label="Password" {...form.getInputProps("password")} />
					<PasswordInput label="Confirm Password" {...form.getInputProps("confirmPassword")} />
					<Button type="submit">Create Account</Button>
					<Text ta="right">
						Already have an account?{" "}
						<UnstyledButton c="brand" fw="bold" component={Link} href="/">
							Login
						</UnstyledButton>
					</Text>
				</Stack>
			</form>
		</Center>
	);
};

export default RegisterPage;
