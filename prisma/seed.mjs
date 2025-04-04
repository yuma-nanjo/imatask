import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// テストユーザーの作成
	const user = await prisma.user.create({
		data: {
			email: "test@example.com",
			name: "テストユーザー",
			// 後でLuciaで認証情報を追加します
		},
	});

	// ルーチンの作成
	const routine = await prisma.routine.create({
		data: {
			title: "朝の準備",
			description: "朝の日課をこなす",
			frequency: "daily",
			priority: "high",
			estimatedTime: 60,
			userId: user.id,
		},
	});

	// タスクの作成
	await prisma.task.createMany({
		data: [
			{
				title: "企画書作成",
				description: "新規プロジェクトの企画書を作成する",
				status: "todo",
				priority: "high",
				dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1週間後
				estimatedTime: 120,
				userId: user.id,
			},
			{
				title: "ミーティング準備",
				description: "週次ミーティングの資料準備",
				status: "inProgress",
				priority: "medium",
				dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1日後
				estimatedTime: 30,
				userId: user.id,
			},
			{
				title: "朝のストレッチ",
				description: "健康維持のための朝のストレッチ",
				status: "todo",
				priority: "medium",
				estimatedTime: 15,
				userId: user.id,
				routineId: routine.id,
			},
		],
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
