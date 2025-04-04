import type { Meta, StoryObj } from "@storybook/react";
import { RoutineDialog } from "@/components/organisms/RoutineDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const meta: Meta<typeof RoutineDialog> = {
	title: "Organisms/RoutineDialog",
	component: RoutineDialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RoutineDialog>;

export const Default: Story = {
	args: {
		trigger: (
			<Button>
				<PlusIcon className="mr-2 h-4 w-4" />
				ルーチン追加
			</Button>
		),
	},
};
