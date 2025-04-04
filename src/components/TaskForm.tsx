"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskInput } from "@/lib/validations";
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

export function TaskForm() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<TaskInput>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			priority: "medium" as const,
			status: "todo" as const,
		},
	});

	const onSubmit = async (data: TaskInput) => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch("/api/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "タスクの作成に失敗しました");
			}

			window.location.href = "/dashboard";
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "タスクの作成に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4"
			aria-label="タスク作成フォーム"
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
				<Label htmlFor="dueDate">期限</Label>
				<Input
					id="dueDate"
					type="date"
					{...register("dueDate")}
					className={errors.dueDate ? "border-red-500" : ""}
					aria-invalid={!!errors.dueDate}
					aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
				/>
				{errors.dueDate && (
					<p id="dueDate-error" className="text-sm text-red-500" role="alert">
						{errors.dueDate.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="priority">優先度</Label>
				<Controller
					name="priority"
					control={control}
					render={({ field }) => (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger
								className={errors.priority ? "border-red-500" : ""}
								aria-invalid={!!errors.priority}
								aria-describedby={
									errors.priority ? "priority-error" : undefined
								}
							>
								<SelectValue placeholder="優先度を選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">低</SelectItem>
								<SelectItem value="medium">中</SelectItem>
								<SelectItem value="high">高</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
				{errors.priority && (
					<p id="priority-error" className="text-sm text-red-500" role="alert">
						{errors.priority.message}
					</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="status">ステータス</Label>
				<Controller
					name="status"
					control={control}
					render={({ field }) => (
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger
								className={errors.status ? "border-red-500" : ""}
								aria-invalid={!!errors.status}
								aria-describedby={errors.status ? "status-error" : undefined}
							>
								<SelectValue placeholder="ステータスを選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="todo">未着手</SelectItem>
								<SelectItem value="in_progress">進行中</SelectItem>
								<SelectItem value="done">完了</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
				{errors.status && (
					<p id="status-error" className="text-sm text-red-500" role="alert">
						{errors.status.message}
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
				{isLoading ? "処理中..." : "タスクを作成"}
			</Button>
		</form>
	);
}
