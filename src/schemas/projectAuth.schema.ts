import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(8, "Password has to be at least 8 characters long"),
  metadata: z.record(z.any()).optional().default({}),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string(),
});

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(8, "Password has to be at least 8 characters long"),
  confirmNewPassword: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

export const resetForgottenPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password has to be at least 8 characters long"),
  confirmNewPassword: z.string(),
});
