import type { Meta, StoryObj } from "@storybook/react";
import { RoutineForm } from "../../components/molecules/RoutineForm";

const meta: Meta<typeof RoutineForm> = {
	title: "Molecules/RoutineForm",
	component: RoutineForm,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RoutineForm>;

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
			title: "既存のルーチン",
			description: "これは既存のルーチンの説明です。",
			frequency: "weekly",
			priority: "high",
			estimatedTime: 30,
		},
	},
};
