import * as z from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters long." })
    .max(30, { error: "Username must be at most 30 characters long." })
    .regex(/^[a-zA-Z][a-zA-Z0-9-]*$/, {
      error:
        "Username must start with a letter and can only contain letters, numbers, and dashes.",
    })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/[a-z]/, {
      error: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      error: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, { error: "Password must contain at least one number." })
    .trim(),
});

export const LoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters long." })
    .trim(),
});
