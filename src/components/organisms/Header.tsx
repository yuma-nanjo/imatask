"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { validateRequest } from "@/lib/auth.server";
import { TaskDialog } from "./TaskDialog";
import { RoutineDialog } from "./RoutineDialog";
import { PlusIcon, Menu } from "lucide-react";
import Link from "next/link";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
	const [user, setUser] = useState<{
		id: string;
		email: string;
		name: string;
		avatarUrl: string | null;
	} | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const { user } = await validateRequest();
			if (user) {
				setUser(user);
			}
		};
		fetchUser();
	}, []);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="flex flex-1 items-center justify-between">
					<div className="flex items-center gap-4">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="md:hidden">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left">
								<SheetHeader>
									<SheetTitle>メニュー</SheetTitle>
								</SheetHeader>
								<div className="mt-4 flex flex-col gap-2">
									<TaskDialog
										trigger={
											<Button className="w-full justify-start">
												<PlusIcon className="mr-2 h-4 w-4" />
												タスク追加
											</Button>
										}
									/>
									<RoutineDialog
										trigger={
											<Button
												variant="outline"
												className="w-full justify-start"
											>
												<PlusIcon className="mr-2 h-4 w-4" />
												ルーチン追加
											</Button>
										}
									/>
								</div>
							</SheetContent>
						</Sheet>
						<Link href="/" className="text-lg font-semibold">
							iMatask
						</Link>
					</div>
					<div className="flex items-center gap-2">
						<div className="hidden md:flex md:items-center md:gap-2">
							<TaskDialog
								trigger={
									<Button size="sm">
										<PlusIcon className="mr-2 h-4 w-4" />
										タスク追加
									</Button>
								}
							/>
							<RoutineDialog
								trigger={
									<Button size="sm" variant="outline">
										<PlusIcon className="mr-2 h-4 w-4" />
										ルーチン追加
									</Button>
								}
							/>
						</div>
						{user && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-8 w-8 rounded-full"
									>
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={user.avatarUrl || undefined}
												alt={user.name}
											/>
											<AvatarFallback>
												{user.name.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{user.name}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/settings">設定</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/api/auth/logout">ログアウト</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
