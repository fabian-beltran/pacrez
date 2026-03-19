"use client";
import { Alert, Button, Center, Grid, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import * as z from "zod";
import { loginAction } from "@/server-actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
	email: z.email("Invalid email address").regex(/@.*\.?pacific\.edu$/, "Must use your Pacific email"),
	password: z.string(),
});

export default function Home() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},
		validate: zod4Resolver(loginSchema),
	});

	const handleSubmit = async ({ email, password }: typeof form.values) => {
		try {
			setLoading(true);
			const result = await loginAction({ email, password });
			console.log(result);
			router.push("/reservations");
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
					<Title ta="center">Login</Title>
					<TextInput label="Email" {...form.getInputProps("email")} />
					<PasswordInput label="Password" {...form.getInputProps("password")} />
					<Grid>
						<Grid.Col span={7}>
							<Button fullWidth type="submit" loading={loading}>
								Login
							</Button>
						</Grid.Col>
						<Grid.Col span={5}>
							<Button variant="outline" fullWidth component={Link} href="/register">
								Register
							</Button>
						</Grid.Col>
					</Grid>
					{errorMessage && <Alert color="red">{errorMessage}</Alert>}
				</Stack>
			</form>
		</Center>
	);
}
