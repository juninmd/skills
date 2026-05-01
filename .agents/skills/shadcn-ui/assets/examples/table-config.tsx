"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type User = {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user" | "viewer";
	status: "active" | "inactive";
};

export const data: User[] = [
	{
		id: "1",
		name: "Alice Johnson",
		email: "alice@example.com",
		role: "admin",
		status: "active",
	},
	{
		id: "2",
		name: "Bob Smith",
		email: "bob@example.com",
		role: "user",
		status: "active",
	},
	{
		id: "3",
		name: "Carol White",
		email: "carol@example.com",
		role: "viewer",
		status: "inactive",
	},
];

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting()}>
				Name <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="capitalize"> {row.getValue("name")} </div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting()}>
				Email <ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="lowercase"> {row.getValue("email")} </div>
		),
	},
	{ accessorKey: "role", header: "Role" },
	{ accessorKey: "status", header: "Status" },
	{
		id: "actions",
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						{" "}
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions </DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => navigator.clipboard.writeText(row.original.id)}
					>
						Copy user ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>View / Edit user </DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
