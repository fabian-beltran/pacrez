import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export function hashCode(code: string) {
	return crypto.createHash("sha256").update(code).digest("hex");
}
export function generateCode() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export const verifyEmailAction = async (code: string) => {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;

	if (!token) throw new Error("Not authenticated");

	const payload = verify(token, process.env.JWT_SECRET!) as { userId: string };

	const codeHash = hashCode(code);

	const record = await prisma.emailVerification.findFirst({
		where: {
			userId: payload.userId,
			codeHash,
			used: false,
			expiresAt: {
				gt: new Date(),
			},
		},
		orderBy: { createdAt: "desc" },
	});

	if (!record) {
		throw new Error("Invalid or expired code");
	}

	await prisma.$transaction([
		prisma.emailVerification.update({
			where: { id: record.id },
			data: { used: true },
		}),
		prisma.user.update({
			where: { id: payload.userId },
			data: { isEmailVerified: true },
		}),
	]);

	return { success: true };
};

export const resendVerificationAction = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth_token")?.value;

	if (!token) throw new Error("Not authenticated");

	const payload = verify(token, process.env.JWT_SECRET!) as { userId: string };

	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
	});

	if (!user) throw new Error("User not found");

	// optional: cooldown check here

	await prisma.emailVerification.deleteMany({
		where: { userId: user.id },
	});

	const code = generateCode();
	const codeHash = hashCode(code);

	await prisma.emailVerification.create({
		data: {
			userId: user.id,
			codeHash,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000),
		},
	});

	await sendVerificationEmail(user.email, code);

	return { success: true };
};

export async function sendVerificationEmail(email: string, code: string) {
	await sendEmail({
		to: email,
		subject: "Verify your email",
		html: `
			<h2>Email Verification</h2>
			<p>Your verification code is:</p>

			<h1 style="letter-spacing: 4px;">${code}</h1>

			<p>This code will expire in <strong>10 minutes</strong>.</p>

			<p>If you did not create an account, you can ignore this email.</p>
		`,
	});
}
