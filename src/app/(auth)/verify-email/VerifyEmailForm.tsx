"use client";

import { useState } from "react";
import { Title, PinInput, Center, Button, Stack, Text } from "@mantine/core";
import { verifyEmailAction, resendVerificationAction } from "@/server-actions/email-verification";
import { useRouter } from "next/navigation";

export default function VerifyEmailForm() {
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleVerify = async (value: string) => {
		setCode(value);

		if (value.length === 6) {
			try {
				setLoading(true);
				setError("");

				await verifyEmailAction(value);

				setSuccess(true);
				setTimeout(() => {
					router.push("/reservations");
				}, 800);
			} catch (error) {
				if (!(error instanceof Error)) return;
				setError(error.message || "Invalid code");
			} finally {
				setLoading(false);
			}
		}
	};

	const handleResend = async () => {
		try {
			setLoading(true);
			setError("");
			await resendVerificationAction();
		} catch (error) {
			if (!(error instanceof Error)) return;
			setError(error.message || "Failed to resend code");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Center style={{ flexDirection: "column" }} py="xl">
			<Stack align="center">
				<Title>Verify Email</Title>

				<Text size="sm" c="dimmed">
					Enter the 6-digit code sent to your email
				</Text>

				<PinInput length={6} value={code} onChange={handleVerify} disabled={loading || success} size="lg" />

				{error && (
					<Text c="red" size="sm">
						{error}
					</Text>
				)}

				{success && (
					<Text c="green" size="sm">
						Email verified successfully!
					</Text>
				)}

				{!success && (
					<Button variant="subtle" size="lg" onClick={handleResend} loading={loading}>
						Send Code
					</Button>
				)}
			</Stack>
		</Center>
	);
}
