"use client";

import { useState } from "react";

export default function TwoFactorPage() {
	const [isEnabled, setIsEnabled] = useState(false);
	const [code, setCode] = useState("");
	const [error, setError] = useState("");

	const handleEnable = async () => {
		try {
			const response = await fetch("/api/auth/two-factor/enable", {
				method: "POST",
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error);
			}

			setIsEnabled(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "2FAの有効化に失敗しました",
			);
		}
	};

	const handleDisable = async () => {
		try {
			const response = await fetch("/api/auth/two-factor/disable", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error);
			}

			setIsEnabled(false);
			setCode("");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "2FAの無効化に失敗しました",
			);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md mx-auto">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<div className="space-y-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">2要素認証</h2>
							<p className="mt-2 text-sm text-gray-600">
								セキュリティを強化するために2要素認証を有効にすることができます。
							</p>
						</div>

						{error && (
							<div className="text-red-500 text-sm text-center">{error}</div>
						)}

						{!isEnabled ? (
							<button
								type="button"
								onClick={handleEnable}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								2要素認証を有効化
							</button>
						) : (
							<div className="space-y-4">
								<div>
									<label
										htmlFor="code"
										className="block text-sm font-medium text-gray-700"
									>
										認証コード
									</label>
									<input
										id="code"
										name="code"
										type="text"
										required
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										placeholder="6桁の認証コード"
										value={code}
										onChange={(e) => setCode(e.target.value)}
									/>
								</div>
								<button
									type="button"
									onClick={handleDisable}
									className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
								>
									2要素認証を無効化
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
