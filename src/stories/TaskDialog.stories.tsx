import type { Meta, StoryObj } from "@storybook/react";
import { TaskDialog } from "@/components/organisms/TaskDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const meta: Meta<typeof TaskDialog> = {
	title: "Organisms/TaskDialog",
	component: TaskDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TaskDialog>;

export const Default: Story = {
	args: {
		trigger: (
			<Button>
				<PlusIcon className="mr-2 h-4 w-4" />
				タスク追加
			</Button>
		),
	},
};
