"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignUpForm() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
	});

	const onSubmit = async (data: SignUpInput) => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "サインアップに失敗しました");
			}

			window.location.href = "/dashboard";
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "サインアップに失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4"
			role="form"
			aria-label="サインアップフォーム"
		>
			<div className="space-y-2">
				<Label htmlFor="name">名前</Label>
				<Input
					id="name"
					type="text"
					{...register("name")}
					className={errors.name ? "border-red-500" : ""}
					aria-invalid={!!errors.name}
					aria-describedby={errors.name ? "name-error" : undefined}
				/>
				{errors.name && (
					<p id="name-error" className="text-sm text-red-500" role="alert">
						{errors.name.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">メールアドレス</Label>
				<Input
					id="email"
					type="email"
					{...register("email")}
					className={errors.email ? "border-red-500" : ""}
					aria-invalid={!!errors.email}
					aria-describedby={errors.email ? "email-error" : undefined}
				/>
				{errors.email && (
					<p id="email-error" className="text-sm text-red-500" role="alert">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">パスワード</Label>
				<Input
					id="password"
					type="password"
					{...register("password")}
					className={errors.password ? "border-red-500" : ""}
					aria-invalid={!!errors.password}
					aria-describedby={errors.password ? "password-error" : undefined}
				/>
				{errors.password && (
					<p id="password-error" className="text-sm text-red-500" role="alert">
						{errors.password.message}
					</p>
				)}
			</div>

			{error && (
				<Alert variant="destructive" role="alert">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Button
				type="submit"
				className="w-full"
				disabled={isLoading}
				aria-busy={isLoading}
			>
				{isLoading ? "処理中..." : "サインアップ"}
			</Button>
		</form>
	);
}
