import {z} from "zod";

export const usernameValidation = z
.string()
.min(2, "Username must be at least 2 characters")
.max(20, "Username must be no more than 20 characters")
.regex(/^[a-zA-Z0-9\s]+$/, "Username must have no special characters")

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})