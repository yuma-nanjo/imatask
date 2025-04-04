"use client";

import type { Task } from "@/lib/types";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
	task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
	const getBadgeVariant = (priority: string) => {
		switch (priority) {
			case "high":
				return "destructive";
			case "medium":
				return "secondary";
			case "low":
				return "default";
			default:
				return "default";
		}
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardContent className="p-4">
				<div className="flex flex-col gap-2">
					<div className="flex justify-between items-start">
						<h3 className="font-medium">{task.title}</h3>
						{task.priority && (
							<Badge variant={getBadgeVariant(task.priority)}>
								{task.priority}
							</Badge>
						)}
					</div>
					{task.description && (
						<p className="text-sm text-muted-foreground">{task.description}</p>
					)}
					{task.dueDate && (
						<p className="text-xs text-muted-foreground">
							Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
