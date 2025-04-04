"use client";

import { Header } from "@/components/organisms/Header";
import { KanbanBoard } from "@/components/organisms/KanbanBoard";
import { Sidebar } from "@/components/organisms/Sidebar";
import type { NavItem, Task } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [navItems, setNavItems] = useState<NavItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [tasksResponse, navItemsResponse] = await Promise.all([
					fetch("/api/tasks"),
					fetch("/api/nav-items"),
				]);

				if (!tasksResponse.ok || !navItemsResponse.ok) {
					throw new Error("データの取得に失敗しました");
				}

				const tasksData = await tasksResponse.json();
				const navItemsData = await navItemsResponse.json();

				setTasks(tasksData);
				setNavItems(navItemsData);
			} catch (error) {
				console.error("Failed to fetch data:", error);
				toast.error("データの取得に失敗しました");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
		try {
			const response = await fetch(`/api/tasks/${taskId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updates),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || `タスクの更新に失敗しました (${response.status})`,
				);
			}

			const updatedTask = await response.json();
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, ...updatedTask } : task,
				),
			);

			toast.success("タスクを更新しました");
		} catch (error) {
			console.error("タスク更新エラー:", error);
			toast.error(
				error instanceof Error ? error.message : "タスクの更新に失敗しました",
			);

			// 失敗した場合は元の状態に戻す
			setTasks((prevTasks) => [...prevTasks]);
		}
	};

	const handleTaskCreate = async (task: Omit<Task, "id">) => {
		try {
			const response = await fetch("/api/tasks", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(task),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.message ||
						`タスクの作成に失敗しました (${response.status})`,
				);
			}

			const newTask = await response.json();
			setTasks((prevTasks) => [...prevTasks, newTask]);

			// 新しいタスクを取得するためにページを再検証
			const revalidateResponse = await fetch(
				"/api/revalidate?path=/dashboard",
				{
					method: "POST",
				},
			);

			if (revalidateResponse.ok) {
				// 新しいデータを取得
				const tasksResponse = await fetch("/api/tasks");
				if (tasksResponse.ok) {
					const updatedTasks = await tasksResponse.json();
					setTasks(updatedTasks);
				}
			}

			toast.success("タスクを作成しました");
		} catch (error) {
			console.error("Failed to create task:", error);
			toast.error(
				error instanceof Error ? error.message : "タスクの作成に失敗しました",
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-background">
			<Sidebar items={navItems} />
			<div className="flex-1 flex flex-col">
				<Header />
				<main className="flex-1 overflow-auto p-4">
					<KanbanBoard
						tasks={tasks}
						onTaskUpdate={handleTaskUpdate}
						onTaskCreate={handleTaskCreate}
					/>
				</main>
			</div>
		</div>
	);
}
