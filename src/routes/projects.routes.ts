import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/project.schema";

const projectRoutes = new Hono();

projectRoutes.get("/", getProjects);
projectRoutes.post("/", zValidator("json", createProjectSchema), createProject);
projectRoutes.get("/:id", getProject);
projectRoutes.put(
  "/:id",
  zValidator("json", updateProjectSchema),
  updateProject
);
projectRoutes.delete("/:id", deleteProject);

export { projectRoutes };
