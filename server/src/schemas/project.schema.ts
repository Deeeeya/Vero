import { z } from "zod";
import { Platform } from "../../generated/prisma";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  platform: z.nativeEnum(Platform).default("all"),
  accessTTL: z.number().int().positive().default(900),
  refreshTTL: z.number().int().positive().default(43200),
  singleSession: z.boolean().default(false),
});

export const updateProjectSchema = projectSchema.partial(); // any field could be there, not all are required

export type ProjectInput = z.infer<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
