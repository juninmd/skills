"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthLayout() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => setIsLoading(false), 2000);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 font-sans">
			<Tabs defaultValue="login" className="w-[400px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">Login</TabsTrigger>
					<TabsTrigger value="register">Register</TabsTrigger>
				</TabsList>
				<TabsContent value="login">
					<LoginForm isLoading={isLoading} onSubmit={onSubmit} />
				</TabsContent>
				<TabsContent value="register">
					<RegisterForm isLoading={isLoading} onSubmit={onSubmit} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
