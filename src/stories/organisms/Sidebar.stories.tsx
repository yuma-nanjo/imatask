import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "@/components/organisms/Sidebar";

const meta: Meta<typeof Sidebar> = {
	title: "organisms/Sidebar",
	component: Sidebar,
	parameters: {
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
	args: {
		items: [
			{
				id: "1",
				title: "ダッシュボード",
				href: "/",
				icon: "📊",
				order: 0,
				userId: "user1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: "2",
				title: "タスク",
				href: "/tasks",
				icon: "✅",
				order: 1,
				userId: "user1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: "3",
				title: "ルーティン",
				href: "/routines",
				icon: "🔄",
				order: 2,
				userId: "user1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		],
	},
};
