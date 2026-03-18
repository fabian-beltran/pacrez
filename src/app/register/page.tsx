"use client";
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import {
	Button,
	Center,
	Group,
	PasswordInput,
	Stack,
	TextInput,
	Title,
	Text,
	UnstyledButton,
	Alert,
} from "@mantine/core";
import { zod4Resolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import { registerSchemaClient as registerSchema } from "@/lib/schemas/auth";
import { registerAction } from "@/lib/server-actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();
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

	const handleSubmit = async ({ firstName, lastName, email, password }: typeof form.values) => {
		try {
			setLoading(true);
			const result = await registerAction({
				firstName,
				lastName,
				email,
				password,
			});
			console.log(result);
			router.push("/");
		} catch (error) {
			if (!(error instanceof Error)) return;
			console.error(error);
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
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
					<Button type="submit" loading={loading}>
						Create Account
					</Button>
					<Text ta="right">
						Already have an account?{" "}
						<UnstyledButton c="brand" fw="bold" component={Link} href="/">
							Login
						</UnstyledButton>
					</Text>
					{errorMessage && <Alert color="red">{errorMessage}</Alert>}
				</Stack>
			</form>
		</Center>
	);
}
