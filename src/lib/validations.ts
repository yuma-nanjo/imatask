import { z } from "zod";

export const signUpSchema = z.object({
	name: z.string().min(2, "名前は2文字以上で入力してください"),
	email: z.string().email("有効なメールアドレスを入力してください"),
	password: z
		.string()
		.min(8, "パスワードは8文字以上で入力してください")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
			"パスワードは大文字、小文字、数字を含める必要があります",
		),
});

export const signInSchema = z.object({
	email: z.string().email("有効なメールアドレスを入力してください"),
	password: z.string().min(1, "パスワードを入力してください"),
});

export const taskSchema = z.object({
	title: z.string().min(1, "タイトルを入力してください"),
	description: z.string().optional(),
	dueDate: z.date().optional(),
	priority: z.enum(["low", "medium", "high"]),
	status: z.enum(["todo", "in_progress", "done"]),
});

export const routineSchema = z.object({
	title: z.string().min(1, "タイトルを入力してください"),
	description: z.string().optional(),
	frequency: z.enum(["daily", "weekly", "monthly"]),
	dayOfWeek: z.number().min(0).max(6).optional(),
	dayOfMonth: z.number().min(1).max(31).optional(),
	time: z
		.string()
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "有効な時間を入力してください"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type RoutineInput = z.infer<typeof routineSchema>;
