"use client";

import type { Task } from "@/lib/types";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { KanbanColumn } from "../molecules/KanbanColumn";
import { ScrollArea } from "../ui/scroll-area";

interface KanbanBoardProps {
	tasks: Task[];
	onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
	onTaskCreate: (task: Omit<Task, "id">) => Promise<void>;
}

export function KanbanBoard({
	tasks,
	onTaskUpdate,
	onTaskCreate,
}: KanbanBoardProps) {
	const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
	const [updateQueue, setUpdateQueue] = useState<
		{ taskId: string; updates: Partial<Task> }[]
	>([]);

	// 親コンポーネントからの更新を監視
	useEffect(() => {
		setLocalTasks(tasks);
	}, [tasks]);

	// 更新キューを処理
	useEffect(() => {
		const processUpdateQueue = async () => {
			if (updateQueue.length === 0) return;

			const [nextUpdate, ...remainingUpdates] = updateQueue;
			try {
				await onTaskUpdate(nextUpdate.taskId, nextUpdate.updates);
				setUpdateQueue(remainingUpdates);
			} catch (error) {
				console.error("タスク更新エラー:", error);
				toast.error("タスクの更新に失敗しました");
				// エラー時は親コンポーネントの状態に戻す
				setLocalTasks(tasks);
			}
		};

		processUpdateQueue();
	}, [updateQueue, onTaskUpdate, tasks]);

	const handleDragEnd = useCallback((result: DropResult) => {
		if (!result.destination) return;

		const { draggableId, source, destination } = result;
		if (source.droppableId === destination.droppableId) return;

		const taskId = draggableId;
		const newStatus = destination.droppableId as Task["status"];

		// ローカル状態を即座に更新
		setLocalTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId ? { ...task, status: newStatus } : task,
			),
		);

		// 更新をキューに追加
		setUpdateQueue((prev) => [
			...prev,
			{ taskId, updates: { status: newStatus } },
		]);
	}, []);

	const handleTaskCreate = useCallback(
		async (task: Omit<Task, "id">) => {
			try {
				// 一時的なIDを生成
				const tempId = `temp-${Date.now()}`;
				const tempTask: Task = {
					...task,
					id: tempId,
					status: "todo",
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				// ローカル状態を即座に更新
				setLocalTasks((prevTasks) => [...prevTasks, tempTask]);

				// 親コンポーネントのonTaskCreateを呼び出し
				await onTaskCreate(task);

				// 成功したら一時的なタスクを削除（親コンポーネントの更新で新しいタスクが追加される）
				setLocalTasks((prevTasks) => prevTasks.filter((t) => t.id !== tempId));
			} catch (error) {
				console.error("タスク作成エラー:", error);
				toast.error("タスクの作成に失敗しました");
				// エラー時は一時的なタスクを削除
				setLocalTasks((prevTasks) =>
					prevTasks.filter((t) => !t.id.startsWith("temp-")),
				);
			}
		},
		[onTaskCreate],
	);

	const handleTaskUpdate = useCallback(
		async (taskId: string, updates: Partial<Task>) => {
			// ローカル状態を即座に更新
			setLocalTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, ...updates } : task,
				),
			);

			// 更新をキューに追加
			setUpdateQueue((prev) => [...prev, { taskId, updates }]);
		},
		[],
	);

	const todoTasks = localTasks.filter((task) => task.status === "todo");
	const inProgressTasks = localTasks.filter(
		(task) => task.status === "inProgress",
	);
	const doneTasks = localTasks.filter((task) => task.status === "done");

	return (
		<div className="h-full">
			<DragDropContext onDragEnd={handleDragEnd}>
				<ScrollArea className="h-full">
					<div className="flex flex-col md:flex-row gap-4 p-4">
						<div className="w-full md:w-1/3">
							<KanbanColumn
								title="未着手"
								tasks={todoTasks}
								status="todo"
								onTaskUpdate={handleTaskUpdate}
								onTaskCreate={handleTaskCreate}
							/>
						</div>
						<div className="w-full md:w-1/3">
							<KanbanColumn
								title="進行中"
								tasks={inProgressTasks}
								status="inProgress"
								onTaskUpdate={handleTaskUpdate}
								onTaskCreate={handleTaskCreate}
							/>
						</div>
						<div className="w-full md:w-1/3">
							<KanbanColumn
								title="完了"
								tasks={doneTasks}
								status="done"
								onTaskUpdate={handleTaskUpdate}
								onTaskCreate={handleTaskCreate}
							/>
						</div>
					</div>
				</ScrollArea>
			</DragDropContext>
		</div>
	);
}
