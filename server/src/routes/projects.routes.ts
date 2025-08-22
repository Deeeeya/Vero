import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { projectSchema, updateProjectSchema } from "../schemas/project.schema";
import { auth } from "../middlewares/auth.middleware";

const projectRoutes = new Hono();

projectRoutes.get("/", auth, getProjects);
projectRoutes.post("/", auth, zValidator("json", projectSchema), createProject);
projectRoutes.get("/:id", auth, getProject);
projectRoutes.put(
  "/:id",
  auth,
  zValidator("json", updateProjectSchema),
  updateProject
);
projectRoutes.delete("/:id", auth, deleteProject);

export { projectRoutes };
