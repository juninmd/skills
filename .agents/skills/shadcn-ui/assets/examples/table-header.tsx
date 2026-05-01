"use client";

import type { Table as TableType } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function DataTableHeader<TData>({ table }: { table: TableType<TData> }) {
	return (
		<div className="flex items-center py-4">
			<Input
				placeholder="Filter names..."
				value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
				onChange={(event) =>
					table.getColumn("name")?.setFilterValue(event.target.value)
				}
				className="max-w-sm"
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="ml-auto">
						Columns <ChevronDown className="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{table
						.getAllColumns()
						.filter((c) => c.getCanHide())
						.map((column) => (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
