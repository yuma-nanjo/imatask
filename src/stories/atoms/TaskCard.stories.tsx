import type { Meta, StoryObj } from "@storybook/react";
import { TaskCard } from "../../components/atoms/TaskCard";

const meta: Meta<typeof TaskCard> = {
	title: "Atoms/TaskCard",
	component: TaskCard,
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: "select",
			options: ["todo", "inProgress", "done"],
		},
		priority: {
			control: "select",
			options: ["low", "medium", "high"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
	args: {
		title: "タスクのタイトル",
		description: "タスクの詳細説明がここに入ります。",
		status: "todo",
		priority: "medium",
		dueDate: new Date(),
	},
};

export const HighPriority: Story = {
	args: {
		title: "緊急タスク",
		description: "これは優先度の高いタスクです。",
		status: "inProgress",
		priority: "high",
		dueDate: new Date(),
	},
};

export const Done: Story = {
	args: {
		title: "完了したタスク",
		description: "このタスクは完了しています。",
		status: "done",
		priority: "low",
		dueDate: new Date(),
	},
};
