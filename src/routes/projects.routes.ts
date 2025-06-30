import { Hono } from "hono";
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";

const projectRoutes = new Hono();

projectRoutes.get("/", getProjects);
projectRoutes.post("/", createProject);
projectRoutes.get("/:id", getProject);
projectRoutes.put("/:id", updateProject);
projectRoutes.delete("/:id", deleteProject);

export { projectRoutes };
