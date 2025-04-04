"use client";

import type { Task } from "@/lib/types";
import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard";
import { Button } from "../atoms/Button";
import { PlusIcon } from "lucide-react";

interface KanbanColumnProps {
	title: string;
	tasks: Task[];
	status: Task["status"];
	onTaskCreate?: (task: Omit<Task, "id">) => void;
	onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

export function KanbanColumn({
	title,
	tasks,
	status,
	onTaskCreate,
	onTaskUpdate,
}: KanbanColumnProps) {
	return (
		<Droppable droppableId={status}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className="flex h-full min-h-[300px] md:min-h-[500px] w-full flex-col rounded-lg border bg-background p-4"
				>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">{title}</h3>
						{status === "todo" && onTaskCreate && (
							<Button
								variant="secondary"
								onClick={() =>
									onTaskCreate({
										title: "新しいタスク",
										description: null,
										status: "todo",
										priority: "medium",
										dueDate: null,
										estimatedTime: null,
										actualTime: null,
										startTime: null,
										endTime: null,
										duration: null,
										routineId: null,
										userId: "", // ユーザーIDは後でサーバー側で設定
										createdAt: new Date(),
										updatedAt: new Date(),
									})
								}
								className="h-8 w-8 p-0 flex items-center justify-center"
							>
								<PlusIcon className="h-4 w-4 shrink-0" />
							</Button>
						)}
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto">
						{tasks.map((task, index) => (
							<KanbanCard
								key={task.id}
								task={task}
								index={index}
								onUpdate={onTaskUpdate}
							/>
						))}
						{provided.placeholder}
					</div>
				</div>
			)}
		</Droppable>
	);
}
