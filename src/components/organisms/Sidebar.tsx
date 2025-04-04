"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskDialog } from "./TaskDialog";
import { RoutineDialog } from "./RoutineDialog";
import type { NavItem } from "@prisma/client";

interface SidebarProps {
	items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
	const pathname = usePathname();

	return (
		<>
			{/* モバイル用のシート */}
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="fixed left-4 top-4 z-50 md:hidden"
					>
						<Menu className="h-5 w-5" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[280px] p-0">
					<SheetHeader className="p-4">
						<SheetTitle>iMatask</SheetTitle>
					</SheetHeader>
					<nav className="flex flex-col gap-1 p-2">
						{items.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
									pathname === item.href
										? "bg-primary text-primary-foreground"
										: "hover:bg-accent hover:text-accent-foreground",
								)}
							>
								{item.icon}
								{item.title}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>

			{/* デスクトップ用のサイドバー */}
			<div className="hidden h-screen w-[280px] flex-col border-r bg-background md:flex">
				<div className="flex h-14 items-center border-b px-4">
					<Link href="/" className="text-lg font-semibold">
						iMatask
					</Link>
				</div>
				<nav className="flex flex-col gap-1 p-2">
					{items.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								pathname === item.href
									? "bg-primary text-primary-foreground"
									: "hover:bg-accent hover:text-accent-foreground",
							)}
						>
							{item.icon}
							{item.title}
						</Link>
					))}
				</nav>
			</div>

			{/* モバイル用のボトムナビゲーション */}
			<div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
				<nav className="container flex h-16 items-center justify-between px-4">
					{items.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex flex-col items-center gap-1 text-xs font-medium transition-colors",
								pathname === item.href
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{item.icon}
							<span>{item.title}</span>
						</Link>
					))}
				</nav>
				<div className="absolute -top-6 left-1/2 -translate-x-1/2 transform space-x-2">
					<TaskDialog
						trigger={
							<Button size="icon" className="h-12 w-12 rounded-full">
								<Plus className="h-6 w-6" />
							</Button>
						}
					/>
					<RoutineDialog
						trigger={
							<Button
								size="icon"
								variant="outline"
								className="h-12 w-12 rounded-full"
							>
								<Plus className="h-6 w-6" />
							</Button>
						}
					/>
				</div>
			</div>
		</>
	);
}
