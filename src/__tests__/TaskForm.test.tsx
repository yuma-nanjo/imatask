import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskForm } from "@/components/TaskForm";
import { describe, it, expect, vi } from "vitest";

describe("TaskForm", () => {
	it("バリデーションエラーを表示する", async () => {
		render(<TaskForm />);
		const submitButton = screen.getByRole("button", { name: "タスクを作成" });

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("タイトルを入力してください"),
			).toBeInTheDocument();
		});
	});

	it("無効な日付でエラーを表示する", async () => {
		render(<TaskForm />);
		const dueDateInput = screen.getByLabelText("期限");

		fireEvent.change(dueDateInput, { target: { value: "invalid-date" } });
		fireEvent.blur(dueDateInput);

		await waitFor(() => {
			expect(
				screen.getByText("有効な日付を入力してください"),
			).toBeInTheDocument();
		});
	});

	it("正常な入力でフォームを送信できる", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});
		global.fetch = mockFetch;

		render(<TaskForm />);

		fireEvent.change(screen.getByLabelText("タイトル"), {
			target: { value: "テストタスク" },
		});
		fireEvent.change(screen.getByLabelText("説明"), {
			target: { value: "これはテストタスクです" },
		});
		fireEvent.change(screen.getByLabelText("期限"), {
			target: { value: "2024-12-31" },
		});
		fireEvent.change(screen.getByLabelText("優先度"), {
			target: { value: "high" },
		});
		fireEvent.change(screen.getByLabelText("ステータス"), {
			target: { value: "todo" },
		});

		fireEvent.click(screen.getByRole("button", { name: "タスクを作成" }));

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith("/api/tasks", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: "テストタスク",
					description: "これはテストタスクです",
					dueDate: "2024-12-31",
					priority: "high",
					status: "todo",
				}),
			});
		});
	});
});
