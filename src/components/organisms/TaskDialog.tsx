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
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
	trigger: React.ReactNode;
}

export function TaskDialog({ trigger }: TaskDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState<Date | undefined>();
	const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/tasks", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					dueDate: dueDate?.toISOString(),
					priority,
					status: "todo",
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create task");
			}

			setOpen(false);
			// フォームをリセット
			setTitle("");
			setDescription("");
			setDueDate(undefined);
			setPriority("medium");
		} catch (err) {
			setError("タスクの作成に失敗しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>タスクを追加</DialogTitle>
					<DialogDescription>
						新しいタスクの詳細を入力してください。
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
						<Label>期限</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!dueDate && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{dueDate ? (
										format(dueDate, "PPP", { locale: ja })
									) : (
										<span>期限を選択</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={dueDate}
									onSelect={setDueDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
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
