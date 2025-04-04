import type { Meta, StoryObj } from "@storybook/react";
import { KanbanColumn } from "../../components/molecules/KanbanColumn";

const meta: Meta<typeof KanbanColumn> = {
	title: "Molecules/KanbanColumn",
	component: KanbanColumn,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KanbanColumn>;

export const TodoColumn: Story = {
	args: {
		title: "To Do",
		status: "todo",
		tasks: [
			{
				id: "1",
				title: "タスク1",
				description: "これはTo Doのタスクです",
				dueDate: new Date(),
				priority: "medium",
			},
			{
				id: "2",
				title: "タスク2",
				description: "これもTo Doのタスクです",
				dueDate: new Date(),
				priority: "high",
			},
		],
	},
};

export const InProgressColumn: Story = {
	args: {
		title: "In Progress",
		status: "inProgress",
		tasks: [
			{
				id: "3",
				title: "進行中のタスク",
				description: "現在進行中のタスクです",
				dueDate: new Date(),
				priority: "high",
			},
		],
	},
};

export const DoneColumn: Story = {
	args: {
		title: "Done",
		status: "done",
		tasks: [
			{
				id: "4",
				title: "完了したタスク",
				description: "完了したタスクです",
				dueDate: new Date(),
				priority: "low",
			},
		],
	},
};
