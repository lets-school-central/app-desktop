import {z} from "zod";

export const fullUserSchema = z
    .object({
        id: z.string(),
        username: z.string().min(3).max(255),
        password: z.string().min(8).max(255),
        verified: z.boolean(),
        email: z.string().email(),
        emailVisibility: z.boolean(),
        avatar: z.string(),
    });

export const userSchema = fullUserSchema
    .omit({password: true});

export const userLoginSchema = fullUserSchema
    .pick({username: true, password: true});
