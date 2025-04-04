"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routineSchema, type RoutineInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RoutineForm() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<RoutineInput>({
		resolver: zodResolver(routineSchema),
	});

	const frequency = watch("frequency");

	const onSubmit = async (data: RoutineInput) => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch("/api/routines", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "ルーティンの作成に失敗しました");
			}

			window.location.href = "/dashboard";
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "ルーティンの作成に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4"
			aria-label="ルーティン作成フォーム"
		>
			<div className="space-y-2">
				<Label htmlFor="title">タイトル</Label>
				<Input
					id="title"
					type="text"
					{...register("title")}
					className={errors.title ? "border-red-500" : ""}
					aria-invalid={!!errors.title}
					aria-describedby={errors.title ? "title-error" : undefined}
				/>
				{errors.title && (
					<p id="title-error" className="text-sm text-red-500" role="alert">
						{errors.title.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">説明</Label>
				<Textarea
					id="description"
					{...register("description")}
					className={errors.description ? "border-red-500" : ""}
					aria-invalid={!!errors.description}
					aria-describedby={
						errors.description ? "description-error" : undefined
					}
				/>
				{errors.description && (
					<p
						id="description-error"
						className="text-sm text-red-500"
						role="alert"
					>
						{errors.description.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="frequency">頻度</Label>
				<Controller
					name="frequency"
					control={control}
					render={({ field }) => (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger
								id="frequency"
								className={errors.frequency ? "border-red-500" : ""}
								aria-invalid={!!errors.frequency}
								aria-describedby={
									errors.frequency ? "frequency-error" : undefined
								}
							>
								<SelectValue placeholder="頻度を選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="daily">毎日</SelectItem>
								<SelectItem value="weekly">毎週</SelectItem>
								<SelectItem value="monthly">毎月</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
				{errors.frequency && (
					<p id="frequency-error" className="text-sm text-red-500" role="alert">
						{errors.frequency.message}
					</p>
				)}
			</div>

			{frequency === "weekly" && (
				<div className="space-y-2">
					<Label htmlFor="dayOfWeek">曜日</Label>
					<Controller
						name="dayOfWeek"
						control={control}
						render={({ field }) => (
							<Select
								onValueChange={(value) =>
									field.onChange(Number.parseInt(value, 10))
								}
								value={field.value?.toString()}
							>
								<SelectTrigger
									id="dayOfWeek"
									className={errors.dayOfWeek ? "border-red-500" : ""}
									aria-invalid={!!errors.dayOfWeek}
									aria-describedby={
										errors.dayOfWeek ? "dayOfWeek-error" : undefined
									}
								>
									<SelectValue placeholder="曜日を選択" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">日曜日</SelectItem>
									<SelectItem value="1">月曜日</SelectItem>
									<SelectItem value="2">火曜日</SelectItem>
									<SelectItem value="3">水曜日</SelectItem>
									<SelectItem value="4">木曜日</SelectItem>
									<SelectItem value="5">金曜日</SelectItem>
									<SelectItem value="6">土曜日</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.dayOfWeek && (
						<p
							id="dayOfWeek-error"
							className="text-sm text-red-500"
							role="alert"
						>
							{errors.dayOfWeek.message}
						</p>
					)}
				</div>
			)}

			{frequency === "monthly" && (
				<div className="space-y-2">
					<Label htmlFor="dayOfMonth">日</Label>
					<Input
						id="dayOfMonth"
						type="number"
						min={1}
						max={31}
						{...register("dayOfMonth", { valueAsNumber: true })}
						className={errors.dayOfMonth ? "border-red-500" : ""}
						aria-invalid={!!errors.dayOfMonth}
						aria-describedby={
							errors.dayOfMonth ? "dayOfMonth-error" : undefined
						}
					/>
					{errors.dayOfMonth && (
						<p
							id="dayOfMonth-error"
							className="text-sm text-red-500"
							role="alert"
						>
							{errors.dayOfMonth.message}
						</p>
					)}
				</div>
			)}

			<div className="space-y-2">
				<Label htmlFor="time">時間</Label>
				<Input
					id="time"
					type="time"
					{...register("time")}
					className={errors.time ? "border-red-500" : ""}
					aria-invalid={!!errors.time}
					aria-describedby={errors.time ? "time-error" : undefined}
				/>
				{errors.time && (
					<p id="time-error" className="text-sm text-red-500" role="alert">
						{errors.time.message}
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
				{isLoading ? "処理中..." : "ルーティンを作成"}
			</Button>
		</form>
	);
}
