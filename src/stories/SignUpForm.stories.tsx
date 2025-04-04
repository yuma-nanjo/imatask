import type { Meta, StoryObj } from "@storybook/react";
import { SignUpForm } from "@/components/SignUpForm";

const meta: Meta<typeof SignUpForm> = {
	title: "Forms/SignUpForm",
	component: SignUpForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
	args: {},
};

export const WithError: Story = {
	args: {},
	parameters: {
		mockData: [
			{
				url: "/api/auth/signup",
				method: "POST",
				status: 400,
				response: {
					error: "このメールアドレスは既に登録されています",
				},
			},
		],
	},
};

export const Loading: Story = {
	args: {},
	parameters: {
		mockData: [
			{
				url: "/api/auth/signup",
				method: "POST",
				delay: 2000,
				status: 200,
				response: {},
			},
		],
	},
};
