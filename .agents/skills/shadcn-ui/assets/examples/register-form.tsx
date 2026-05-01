"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({ isLoading, onSubmit }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information to create an account.
				</CardDescription>
			</CardHeader>
			<form onSubmit={onSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" placeholder="John Doe" required />
					</div>
					<div className="space-y-2">
						<Label htmlFor="reg-email">Email</Label>
						<Input
							id="reg-email"
							type="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="reg-pass">Password</Label>
						<Input id="reg-pass" type="password" required />
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Creating account..." : "Create account"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
