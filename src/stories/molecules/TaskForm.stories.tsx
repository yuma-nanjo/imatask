import type { Meta, StoryObj } from "@storybook/react";
import { TaskForm } from "../../components/molecules/TaskForm";

const meta: Meta<typeof TaskForm> = {
	title: "Molecules/TaskForm",
	component: TaskForm,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TaskForm>;

export const Default: Story = {
	args: {
		onSubmit: async (data) => {
			console.log("Form submitted:", data);
		},
	},
};

export const WithInitialData: Story = {
	args: {
		onSubmit: async (data) => {
			console.log("Form submitted:", data);
		},
		initialData: {
			title: "既存のタスク",
			description: "これは既存のタスクの説明です。",
			priority: "high",
			status: "inProgress",
			dueDate: new Date(),
			estimatedTime: 60,
		},
	},
};
