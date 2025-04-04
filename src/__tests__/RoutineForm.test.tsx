import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RoutineForm } from "@/components/RoutineForm";
import { describe, it, expect, vi } from "vitest";

describe("RoutineForm", () => {
	it("バリデーションエラーを表示する", async () => {
		render(<RoutineForm />);
		const submitButton = screen.getByRole("button", {
			name: "ルーティンを作成",
		});

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("タイトルを入力してください"),
			).toBeInTheDocument();
			expect(screen.getByText("頻度を選択してください")).toBeInTheDocument();
		});
	});

	it("週次ルーティンのバリデーション", async () => {
		render(<RoutineForm />);

		fireEvent.change(screen.getByLabelText("タイトル"), {
			target: { value: "週次ルーティン" },
		});
		fireEvent.change(screen.getByLabelText("頻度"), {
			target: { value: "weekly" },
		});

		fireEvent.click(screen.getByRole("button", { name: "ルーティンを作成" }));

		await waitFor(() => {
			expect(screen.getByText("曜日を選択してください")).toBeInTheDocument();
		});
	});

	it("月次ルーティンのバリデーション", async () => {
		render(<RoutineForm />);

		fireEvent.change(screen.getByLabelText("タイトル"), {
			target: { value: "月次ルーティン" },
		});
		fireEvent.change(screen.getByLabelText("頻度"), {
			target: { value: "monthly" },
		});

		fireEvent.click(screen.getByRole("button", { name: "ルーティンを作成" }));

		await waitFor(() => {
			expect(screen.getByText("日を選択してください")).toBeInTheDocument();
		});
	});

	it("正常な入力で週次ルーティンを送信できる", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});
		global.fetch = mockFetch;

		render(<RoutineForm />);

		fireEvent.change(screen.getByLabelText("タイトル"), {
			target: { value: "週次ルーティン" },
		});
		fireEvent.change(screen.getByLabelText("説明"), {
			target: { value: "これは週次ルーティンです" },
		});
		fireEvent.change(screen.getByLabelText("頻度"), {
			target: { value: "weekly" },
		});
		fireEvent.change(screen.getByLabelText("曜日"), {
			target: { value: "1" },
		});
		fireEvent.change(screen.getByLabelText("時間"), {
			target: { value: "09:00" },
		});

		fireEvent.click(screen.getByRole("button", { name: "ルーティンを作成" }));

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith("/api/routines", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: "週次ルーティン",
					description: "これは週次ルーティンです",
					frequency: "weekly",
					dayOfWeek: 1,
					time: "09:00",
				}),
			});
		});
	});

	it("正常な入力で月次ルーティンを送信できる", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});
		global.fetch = mockFetch;

		render(<RoutineForm />);

		fireEvent.change(screen.getByLabelText("タイトル"), {
			target: { value: "月次ルーティン" },
		});
		fireEvent.change(screen.getByLabelText("説明"), {
			target: { value: "これは月次ルーティンです" },
		});
		fireEvent.change(screen.getByLabelText("頻度"), {
			target: { value: "monthly" },
		});
		fireEvent.change(screen.getByLabelText("日"), {
			target: { value: "15" },
		});
		fireEvent.change(screen.getByLabelText("時間"), {
			target: { value: "15:00" },
		});

		fireEvent.click(screen.getByRole("button", { name: "ルーティンを作成" }));

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith("/api/routines", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: "月次ルーティン",
					description: "これは月次ルーティンです",
					frequency: "monthly",
					dayOfMonth: 15,
					time: "15:00",
				}),
			});
		});
	});
});
