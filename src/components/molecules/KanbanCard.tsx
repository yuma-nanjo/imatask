"use client";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Task, TaskStatus } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { format } from "date-fns";
import { CheckIcon, PauseIcon, PencilIcon, PlayIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { Textarea } from "../atoms/Textarea";
import { Draggable } from "@hello-pangea/dnd";

interface KanbanCardProps {
	task: Task;
	index: number;
	onUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

export function KanbanCard({ task, index, onUpdate }: KanbanCardProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTask, setEditedTask] = useState<Task>({
		...task,
	});

	const handleStart = () => {
		if (!onUpdate) return;
		onUpdate(task.id, {
			status: "inProgress" as TaskStatus,
			startTime: new Date(),
		});
		toast.success("タスクを開始しました");
	};

	const handlePause = () => {
		if (!onUpdate || !task.startTime) return;
		const now = new Date();
		const duration = Math.floor(
			(now.getTime() - task.startTime.getTime()) / 1000,
		);
		onUpdate(task.id, {
			status: "todo" as TaskStatus,
			duration: (task.duration || 0) + duration,
			startTime: null,
		});
		toast.info("タスクを一時停止しました");
	};

	const handleComplete = () => {
		if (!onUpdate) return;
		const now = new Date();
		const duration = task.startTime
			? Math.floor((now.getTime() - task.startTime.getTime()) / 1000) +
				(task.duration || 0)
			: task.duration || 0;
		onUpdate(task.id, {
			status: "done" as TaskStatus,
			endTime: now,
			duration,
			startTime: null,
		});
		toast.success("タスクを完了しました");
	};

	const handleSave = () => {
		if (!onUpdate) return;
		onUpdate(task.id, editedTask);
		setIsEditing(false);
		setIsOpen(false);
		toast.success("タスクを更新しました");
	};

	const openEditModal = () => {
		setIsEditing(true);
		setIsOpen(true);
	};

	return (
		<>
			<Draggable draggableId={task.id} index={index}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className="w-full rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
					>
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">{task.title}</h3>
							<div className="flex items-center gap-2">
								{task.status === "inProgress" ? (
									<Button
										variant="ghost"
										size="icon"
										onClick={handlePause}
										className="h-8 w-8"
									>
										<PauseIcon className="h-4 w-4" />
									</Button>
								) : task.status === "todo" ? (
									<Button
										variant="ghost"
										size="icon"
										onClick={handleStart}
										className="h-8 w-8"
									>
										<PlayIcon className="h-4 w-4" />
									</Button>
								) : null}
								{task.status !== "done" && (
									<Button
										variant="ghost"
										size="icon"
										onClick={handleComplete}
										className="h-8 w-8"
									>
										<CheckIcon className="h-4 w-4" />
									</Button>
								)}
								<Button
									variant="ghost"
									size="icon"
									onClick={openEditModal}
									className="h-8 w-8"
								>
									<PencilIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
						<p className="mt-2 text-sm text-muted-foreground line-clamp-2">
							{task.description || "説明なし"}
						</p>
						<div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
							<span>予定時間: {formatDuration(task.estimatedTime || 0)}</span>
							<span>
								期限:{" "}
								{task.dueDate
									? format(new Date(task.dueDate), "MM/dd HH:mm")
									: "期限なし"}
							</span>
						</div>
					</div>
				)}
			</Draggable>

			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					setIsOpen(open);
					if (!open) {
						setIsEditing(false);
						setEditedTask(task);
					}
				}}
			>
				<DialogContent>
					{isEditing ? (
						<>
							<DialogHeader>
								<DialogTitle>タスクを編集</DialogTitle>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<label htmlFor="title">タイトル</label>
									<Input
										id="title"
										value={editedTask.title}
										onChange={(e) =>
											setEditedTask({ ...editedTask, title: e.target.value })
										}
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="description">説明</label>
									<Textarea
										id="description"
										value={editedTask.description || ""}
										onChange={(e) =>
											setEditedTask({
												...editedTask,
												description: e.target.value,
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="priority">優先度</label>
									<Select
										id="priority"
										value={editedTask.priority}
										onChange={(e) =>
											setEditedTask({
												...editedTask,
												priority: e.target.value as Task["priority"],
											})
										}
									>
										<option value="high">高</option>
										<option value="medium">中</option>
										<option value="low">低</option>
									</Select>
								</div>
								<div className="space-y-2">
									<label htmlFor="dueDate">期限</label>
									<Input
										id="dueDate"
										type="datetime-local"
										value={
											editedTask.dueDate
												? format(
														new Date(editedTask.dueDate),
														"yyyy-MM-dd'T'HH:mm",
													)
												: ""
										}
										onChange={(e) =>
											setEditedTask({
												...editedTask,
												dueDate: new Date(e.target.value),
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="estimatedTime">予定時間（分）</label>
									<Input
										id="estimatedTime"
										type="number"
										value={editedTask.estimatedTime || 0}
										onChange={(e) =>
											setEditedTask({
												...editedTask,
												estimatedTime: Number.parseInt(e.target.value),
											})
										}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="ghost"
									onClick={() => {
										setIsEditing(false);
										setIsOpen(false);
										setEditedTask(task);
									}}
								>
									キャンセル
								</Button>
								<Button onClick={handleSave}>保存</Button>
							</DialogFooter>
						</>
					) : (
						<>
							<DialogHeader>
								<DialogTitle className="flex items-center justify-between">
									{task.title}
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setIsEditing(true)}
										className="h-8 w-8"
									>
										<PencilIcon className="h-4 w-4" />
									</Button>
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<h4 className="font-medium">説明</h4>
									<p className="text-sm text-muted-foreground">
										{task.description || "説明なし"}
									</p>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">ステータス</h4>
									<p className="text-sm text-muted-foreground">
										{task.status === "todo" && "未着手"}
										{task.status === "inProgress" && "進行中"}
										{task.status === "done" && "完了"}
									</p>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">優先度</h4>
									<p className="text-sm text-muted-foreground">
										{task.priority === "low" && "低"}
										{task.priority === "medium" && "中"}
										{task.priority === "high" && "高"}
									</p>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">期限</h4>
									<p className="text-sm text-muted-foreground">
										{task.dueDate
											? format(new Date(task.dueDate), "yyyy/MM/dd HH:mm")
											: "期限なし"}
									</p>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">予定時間</h4>
									<p className="text-sm text-muted-foreground">
										{formatDuration(task.estimatedTime || 0)}
									</p>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
