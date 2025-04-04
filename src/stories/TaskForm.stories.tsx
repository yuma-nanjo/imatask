import type { Meta, StoryObj } from "@storybook/react";
import { TaskForm } from "@/components/TaskForm";

const meta: Meta<typeof TaskForm> = {
	title: "Forms/TaskForm",
	component: TaskForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TaskForm>;

export const Default: Story = {
	args: {},
};

export const WithError: Story = {
	args: {},
	parameters: {
		mockData: [
			{
				url: "/api/tasks",
				method: "POST",
				status: 400,
				response: {
					error: "タスクの作成に失敗しました",
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
				url: "/api/tasks",
				method: "POST",
				delay: 2000,
				status: 200,
				response: {},
			},
		],
	},
};
