"use client";

import { FC, useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";

interface SignUpFormProps {
	onSubmit: (data: {
		email: string;
		password: string;
		name: string;
	}) => Promise<void>;
}

export const SignUpForm: FC<SignUpFormProps> = ({ onSubmit }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit(formData);
		} catch (error) {
			console.error("Sign up failed:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700"
				>
					名前
				</label>
				<Input
					id="name"
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					required
					placeholder="山田 太郎"
					className="mt-1"
				/>
			</div>
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					メールアドレス
				</label>
				<Input
					id="email"
					type="email"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					required
					placeholder="example@example.com"
					className="mt-1"
				/>
			</div>
			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-gray-700"
				>
					パスワード
				</label>
				<Input
					id="password"
					type="password"
					value={formData.password}
					onChange={(e) =>
						setFormData({ ...formData, password: e.target.value })
					}
					required
					placeholder="********"
					className="mt-1"
				/>
			</div>
			<Button type="submit" disabled={loading} className="w-full">
				{loading ? "登録中..." : "登録する"}
			</Button>
		</form>
	);
};
