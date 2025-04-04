import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

export async function sendVerificationEmail(email: string, token: string) {
	const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		to: email,
		subject: "メールアドレスの確認",
		html: `
      <h1>メールアドレスの確認</h1>
      <p>以下のリンクをクリックして、メールアドレスを確認してください：</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>このリンクは24時間有効です。</p>
    `,
	});
}

export async function sendTwoFactorCode(email: string, code: string) {
	await transporter.sendMail({
		from: process.env.SMTP_FROM,
		to: email,
		subject: "2要素認証コード",
		html: `
      <h1>2要素認証コード</h1>
      <p>以下のコードを入力してください：</p>
      <h2>${code}</h2>
      <p>このコードは5分間有効です。</p>
    `,
	});
}
