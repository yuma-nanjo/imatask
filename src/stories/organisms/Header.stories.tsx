import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../../components/organisms/Header";
import type { User } from "@prisma/client";

const meta: Meta<typeof Header> = {
	title: "Organisms/Header",
	component: Header,
	tags: ["autodocs"],
	parameters: {
		nextjs: {
			appDirectory: true,
		},
	},
};

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
	args: {},
};

export const LoggedIn: Story = {
	args: {
		user: {
			id: "1",
			name: "山田 太郎",
			email: "yamada@example.com",
			avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=yamada",
			hashedPassword: "hashed_password",
			isEmailVerified: true,
			twoFactorEnabled: false,
			trustedDevices: "[]",
			loginAttempts: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as User,
		onSignOut: async () => {
			console.log("Sign out clicked");
		},
	},
};
