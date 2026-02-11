"use client";
import { Button, Center, Grid, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import * as z from "zod";

const loginSchema = z.object({
	email: z.email("Invalid email address").regex(/@.*\.?pacific\.edu$/, "Must use your Pacific email"),
	password: z.string(),
});

export default function Home() {
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},
		validate: zod4Resolver(loginSchema),
	});

	const handleSubmit = (values: typeof form.values) => {
		console.log("Login values:", values);
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
							<Button fullWidth type="submit">
								Login
							</Button>
						</Grid.Col>
						<Grid.Col span={5}>
							<Button variant="outline" fullWidth component={Link} href="/register">
								Register
							</Button>
						</Grid.Col>
					</Grid>
				</Stack>
			</form>
		</Center>
	);
}
