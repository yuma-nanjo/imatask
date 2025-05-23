import type { Preview } from "@storybook/react";
import "../src/app/globals.css"; // Tailwind CSSのスタイルを読み込む

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		nextjs: {
			appDirectory: true,
		},
	},
};

export default preview;
