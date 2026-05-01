import * as z from "zod";

export const formSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	role: z.enum(["admin", "user", "viewer"], {
		required_error: "Please select a role.",
	}),
	bio: z
		.string()
		.max(160, {
			message: "Bio must not be longer than 160 characters.",
		})
		.optional(),
});

export type FormValues = z.infer<typeof formSchema>;
