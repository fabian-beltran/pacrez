import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
	return await transporter.sendMail({
		from: `"PacRez" <${process.env.EMAIL_USER}>`,
		to,
		subject: `PacRez - ${subject}`,
		html,
	});
}
