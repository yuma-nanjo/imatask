"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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

interface RoutineDialogProps {
	trigger: React.ReactNode;
}

export function RoutineDialog({ trigger }: RoutineDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
		"daily",
	);
	const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
	const [estimatedTime, setEstimatedTime] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/routines", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					frequency,
					priority,
					estimatedTime: parseInt(estimatedTime) || 0,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create routine");
			}

			setOpen(false);
			// フォームをリセット
			setTitle("");
			setDescription("");
			setFrequency("daily");
			setPriority("medium");
			setEstimatedTime("");
		} catch (error) {
			setError("ルーチンの作成に失敗しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>ルーチンを追加</DialogTitle>
					<DialogDescription>
						新しいルーチンの詳細を入力してください。
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">タイトル</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							className="w-full"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">説明</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="min-h-[100px] w-full"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="frequency">頻度</Label>
						<Select
							value={frequency}
							onValueChange={(value: "daily" | "weekly" | "monthly") =>
								setFrequency(value)
							}
						>
							<SelectTrigger id="frequency">
								<SelectValue placeholder="頻度を選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="daily">毎日</SelectItem>
								<SelectItem value="weekly">毎週</SelectItem>
								<SelectItem value="monthly">毎月</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="priority">優先度</Label>
						<Select
							value={priority}
							onValueChange={(value: "low" | "medium" | "high") =>
								setPriority(value)
							}
						>
							<SelectTrigger id="priority">
								<SelectValue placeholder="優先度を選択" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="low">低</SelectItem>
								<SelectItem value="medium">中</SelectItem>
								<SelectItem value="high">高</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="estimatedTime">所要時間（分）</Label>
						<Input
							id="estimatedTime"
							type="number"
							min="0"
							value={estimatedTime}
							onChange={(e) => setEstimatedTime(e.target.value)}
							className="w-full"
						/>
					</div>
					{error && <div className="text-sm text-red-500">{error}</div>}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSubmitting}
						>
							キャンセル
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "作成中..." : "作成"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
