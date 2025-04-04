import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import "@testing-library/jest-dom";
import { expect } from "vitest";

export const renderWithProviders = (ui: ReactElement) => {
	return {
		user: userEvent.setup(),
		...render(ui),
	};
};

export const fillForm = async (fields: Record<string, string>) => {
	for (const [name, value] of Object.entries(fields)) {
		const input = screen.getByLabelText(name);
		await userEvent.type(input, value);
	}
};

export const submitForm = async () => {
	const submitButton = screen.getByRole("button", { name: /送信|作成|登録/i });
	await userEvent.click(submitButton);
};

export const expectValidationError = async (errorMessage: string) => {
	await waitFor(() => {
		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});
};
