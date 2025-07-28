import { z } from "zod";
import { Platform } from "../../generated/prisma";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  platform: z.nativeEnum(Platform).default("all"),
  accessTTL: z.number().int().positive().default(900),
  refreshTTL: z.number().int().positive().default(43200),
  singleSession: z.boolean().default(false),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  platform: z.nativeEnum(Platform).default("all"),
  accessTTL: z.number().int().positive().default(900),
  refreshTTL: z.number().int().positive().default(43200),
  singleSession: z.boolean().default(false),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
