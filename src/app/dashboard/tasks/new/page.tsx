"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function NewTaskPage() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState<Date | undefined>();
	const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/tasks", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					description,
					dueDate,
					priority,
					status: "todo",
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create task");
			}

			router.push("/dashboard");
		} catch (error) {
			console.error("Failed to create task:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container max-w-2xl py-8">
			<h1 className="text-2xl font-bold mb-6">新規タスク</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="title">タイトル</Label>
					<Input
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">説明</Label>
					<Textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
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
								{dueDate ? format(dueDate, "PPP") : "期限を選択"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
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
					<Label>優先度</Label>
					<Select
						value={priority}
						onValueChange={(value: "low" | "medium" | "high") =>
							setPriority(value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="優先度を選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="low">低</SelectItem>
							<SelectItem value="medium">中</SelectItem>
							<SelectItem value="high">高</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex justify-end gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.back()}
						disabled={isSubmitting}
					>
						キャンセル
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "作成中..." : "作成"}
					</Button>
				</div>
			</form>
		</div>
	);
}
