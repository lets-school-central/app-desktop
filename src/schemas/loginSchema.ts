import * as z from "zod";

export const loginSchema = z.object({
	username: z.string().nonempty().min(3).max(100),
	password: z.string().min(8).max(100),
});
