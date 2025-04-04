import type { Meta, StoryObj } from "@storybook/react";
import { SignUpForm } from "../../components/molecules/SignUpForm";

const meta: Meta<typeof SignUpForm> = {
	title: "Molecules/SignUpForm",
	component: SignUpForm,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
	args: {
		onSubmit: async (data) => {
			console.log("Form submitted:", data);
		},
	},
};
