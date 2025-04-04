import type { Meta, StoryObj } from "@storybook/react";
import { KanbanBoard } from "../../components/organisms/KanbanBoard";

const meta: Meta<typeof KanbanBoard> = {
	title: "Organisms/KanbanBoard",
	component: KanbanBoard,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const Default: Story = {
	args: {
		tasks: [
			{
				id: "1",
				title: "タスク1",
				description: "To Doのタスクです",
				dueDate: new Date(),
				priority: "medium",
				status: "todo",
			},
			{
				id: "2",
				title: "タスク2",
				description: "進行中のタスクです",
				dueDate: new Date(),
				priority: "high",
				status: "inProgress",
			},
			{
				id: "3",
				title: "タスク3",
				description: "完了したタスクです",
				dueDate: new Date(),
				priority: "low",
				status: "done",
			},
			{
				id: "4",
				title: "タスク4",
				description: "別のTo Doタスクです",
				dueDate: new Date(),
				priority: "medium",
				status: "todo",
			},
		],
	},
};
