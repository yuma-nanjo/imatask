import type { Meta, StoryObj } from "@storybook/react";
import { RoutineForm } from "@/components/RoutineForm";

const meta: Meta<typeof RoutineForm> = {
	title: "Forms/RoutineForm",
	component: RoutineForm,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RoutineForm>;

export const Default: Story = {
	args: {},
};

export const WeeklyRoutine: Story = {
	args: {},
	parameters: {
		mockData: [
			{
				url: "/api/routines",
				method: "POST",
				status: 200,
				response: {},
			},
		],
	},
};

export const MonthlyRoutine: Story = {
	args: {},
	parameters: {
		mockData: [
			{
				url: "/api/routines",
				method: "POST",
				status: 200,
				response: {},
			},
		],
	},
};

export const WithError: Story = {
	args: {},
	parameters: {
		mockData: [
			{
				url: "/api/routines",
				method: "POST",
				status: 400,
				response: {
					error: "ルーティンの作成に失敗しました",
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
				url: "/api/routines",
				method: "POST",
				delay: 2000,
				status: 200,
				response: {},
			},
		],
	},
};
