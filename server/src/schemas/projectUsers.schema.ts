import { z } from "zod";

export const createProjectUserSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  hashPassword: z
    .string()
    .min(8, "Password has to be at least 8 characters long"),

  metadata: z.record(z.any()).optional().default({}),

  projectId: z.string().min(1, "Project ID is required"),
});

export const updateProjectUserSchema = z.object({
  email: z.string().email("Please enter a new email").optional(),
  hashPassword: z
    .string()
    .min(8, "Password has to be at least 8 characters long")
    .optional(),
  metadata: z.record(z.any()).optional(),
  projectId: z.string().min(1, "Project ID is required").optional(),
});

export const toggleProjectUserSchema = z.object({
  enabled: z.boolean({
    required_error: "Enabled status is required",
    invalid_type_error: "Enabled must be true or false",
  }),
});

export type CreateProjectUserSchema = z.infer<typeof createProjectUserSchema>;
export type UpdateProjectUserSchema = z.infer<typeof updateProjectUserSchema>;
export type ToggleProjectUserSchema = z.infer<typeof toggleProjectUserSchema>;
