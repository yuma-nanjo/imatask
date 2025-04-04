import type { Task as PrismaTask, NavItem, User } from "@prisma/client";

export type TaskStatus = "todo" | "inProgress" | "done";

// Prismaの型を拡張
export interface Task extends PrismaTask {
	status: TaskStatus;
	priority: "low" | "medium" | "high";
}

export type { NavItem, User };

export interface TaskWithRelations extends Task {
	user: User;
}
