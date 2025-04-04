"use client";

import { useState } from "react";
import type { FC } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import type { Task } from "@prisma/client";

interface TaskFormProps {
	onSubmit: (
		data: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">,
	) => Promise<void>;
	initialData?: Partial<Task>;
}

export const TaskForm: FC<TaskFormProps> = ({ onSubmit, initialData = {} }) => {
	const [formData, setFormData] = useState({
		title: initialData.title || "",
		description: initialData.description || "",
		status: initialData.status || "todo",
		priority: initialData.priority || "medium",
		dueDate: initialData.dueDate?.toISOString().split("T")[0] || "",
		estimatedTime: initialData.estimatedTime?.toString() || "",
		actualTime: initialData.actualTime?.toString() || "",
		routineId: initialData.routineId || "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit({
				...formData,
				dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
				estimatedTime: formData.estimatedTime
					? Number.parseInt(formData.estimatedTime, 10)
					: null,
				actualTime: formData.actualTime
					? Number.parseInt(formData.actualTime, 10)
					: null,
				routineId: formData.routineId || null,
			});
		} catch (error) {
			console.error("Task submission failed:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label
					htmlFor="title"
					className="block text-sm font-medium text-gray-700"
				>
					タイトル
				</label>
				<Input
					id="title"
					value={formData.title}
					onChange={(e) => setFormData({ ...formData, title: e.target.value })}
					required
					className="mt-1"
				/>
			</div>

			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-gray-700"
				>
					説明
				</label>
				<textarea
					id="description"
					value={formData.description}
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
					className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows={3}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="status"
						className="block text-sm font-medium text-gray-700"
					>
						ステータス
					</label>
					<select
						id="status"
						value={formData.status}
						onChange={(e) =>
							setFormData({
								...formData,
								status: e.target.value as Task["status"],
							})
						}
						className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="todo">未着手</option>
						<option value="in_progress">進行中</option>
						<option value="done">完了</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="priority"
						className="block text-sm font-medium text-gray-700"
					>
						優先度
					</label>
					<select
						id="priority"
						value={formData.priority}
						onChange={(e) =>
							setFormData({
								...formData,
								priority: e.target.value as Task["priority"],
							})
						}
						className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="low">低</option>
						<option value="medium">中</option>
						<option value="high">高</option>
					</select>
				</div>
			</div>

			<div>
				<label
					htmlFor="dueDate"
					className="block text-sm font-medium text-gray-700"
				>
					期限
				</label>
				<Input
					id="dueDate"
					type="date"
					value={formData.dueDate}
					onChange={(e) =>
						setFormData({ ...formData, dueDate: e.target.value })
					}
					className="mt-1"
				/>
			</div>

			<div>
				<label
					htmlFor="estimatedTime"
					className="block text-sm font-medium text-gray-700"
				>
					予定時間（分）
				</label>
				<Input
					id="estimatedTime"
					type="number"
					min="0"
					value={formData.estimatedTime}
					onChange={(e) =>
						setFormData({ ...formData, estimatedTime: e.target.value })
					}
					className="mt-1"
				/>
			</div>

			<Button type="submit" disabled={loading} className="w-full">
				{loading ? "保存中..." : "保存"}
			</Button>
		</form>
	);
};
