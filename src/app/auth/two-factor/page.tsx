"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TwoFactorAuthPage() {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/auth/two-factor/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error);
			}

			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "認証に失敗しました");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						2要素認証
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						メールで送信された6桁の認証コードを入力してください
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="code" className="sr-only">
							認証コード
						</label>
						<input
							id="code"
							name="code"
							type="text"
							required
							className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="6桁の認証コード"
							value={code}
							onChange={(e) => setCode(e.target.value)}
						/>
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							認証
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
