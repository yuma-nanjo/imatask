import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignUpForm } from "@/components/SignUpForm";
import { describe, it, expect, vi } from "vitest";

describe("SignUpForm", () => {
	it("バリデーションエラーを表示する", async () => {
		render(<SignUpForm />);
		const submitButton = screen.getByRole("button", { name: "サインアップ" });

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("名前は2文字以上で入力してください"),
			).toBeInTheDocument();
			expect(
				screen.getByText("有効なメールアドレスを入力してください"),
			).toBeInTheDocument();
			expect(
				screen.getByText("パスワードは8文字以上で入力してください"),
			).toBeInTheDocument();
		});
	});

	it("無効なメールアドレスでエラーを表示する", async () => {
		render(<SignUpForm />);
		const emailInput = screen.getByLabelText("メールアドレス");

		fireEvent.change(emailInput, { target: { value: "invalid-email" } });
		fireEvent.blur(emailInput);

		await waitFor(() => {
			expect(
				screen.getByText("有効なメールアドレスを入力してください"),
			).toBeInTheDocument();
		});
	});

	it("パスワードの要件を満たしていない場合にエラーを表示する", async () => {
		render(<SignUpForm />);
		const passwordInput = screen.getByLabelText("パスワード");

		fireEvent.change(passwordInput, { target: { value: "weak" } });
		fireEvent.blur(passwordInput);

		await waitFor(() => {
			expect(
				screen.getByText("パスワードは8文字以上で入力してください"),
			).toBeInTheDocument();
		});

		fireEvent.change(passwordInput, { target: { value: "weakpassword" } });
		fireEvent.blur(passwordInput);

		await waitFor(() => {
			expect(
				screen.getByText(
					"パスワードは大文字、小文字、数字を含める必要があります",
				),
			).toBeInTheDocument();
		});
	});

	it("正常な入力でフォームを送信できる", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});
		global.fetch = mockFetch;

		render(<SignUpForm />);

		fireEvent.change(screen.getByLabelText("名前"), {
			target: { value: "テストユーザー" },
		});
		fireEvent.change(screen.getByLabelText("メールアドレス"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText("パスワード"), {
			target: { value: "TestPass123" },
		});

		fireEvent.click(screen.getByRole("button", { name: "サインアップ" }));

		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: "テストユーザー",
					email: "test@example.com",
					password: "TestPass123",
				}),
			});
		});
	});
});
