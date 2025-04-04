"use client";

import { FC, useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import type { Routine } from "@prisma/client";

interface RoutineFormProps {
	onSubmit: (
		data: Omit<Routine, "id" | "userId" | "createdAt" | "updatedAt">,
	) => Promise<void>;
	initialData?: Partial<Routine>;
}

export const RoutineForm: FC<RoutineFormProps> = ({
	onSubmit,
	initialData = {},
}) => {
	const [formData, setFormData] = useState({
		title: initialData.title || "",
		description: initialData.description || "",
		frequency: initialData.frequency || "daily",
		priority: initialData.priority || "medium",
		estimatedTime: initialData.estimatedTime?.toString() || "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit({
				...formData,
				estimatedTime: Number.parseInt(formData.estimatedTime || "0", 10),
			});
		} catch (error) {
			console.error("Routine submission failed:", error);
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
						htmlFor="frequency"
						className="block text-sm font-medium text-gray-700"
					>
						頻度
					</label>
					<select
						id="frequency"
						value={formData.frequency}
						onChange={(e) =>
							setFormData({
								...formData,
								frequency: e.target.value as Routine["frequency"],
							})
						}
						className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="daily">毎日</option>
						<option value="weekly">毎週</option>
						<option value="monthly">毎月</option>
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
								priority: e.target.value as Routine["priority"],
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
					required
					className="mt-1"
				/>
			</div>

			<Button type="submit" disabled={loading} className="w-full">
				{loading ? "保存中..." : "保存"}
			</Button>
		</form>
	);
};
