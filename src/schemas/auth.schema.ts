import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export const updateProfileSchema = z
  .object({
    email: z.string().email("Invalid email"),
  })
  .partial();

export const resetPasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
});

export const requestResetSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const forgotPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
});
