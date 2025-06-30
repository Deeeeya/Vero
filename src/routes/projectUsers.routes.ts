import { Hono } from "hono";
import {
  getProjectUsers,
  createProjectUser,
  getProjectUser,
  updateProjectUser,
  deleteProjectUser,
} from "../controllers/projectUsers.controller";

const projectUserRoutes = new Hono();

projectUserRoutes.get("/", getProjectUsers);
projectUserRoutes.post("/", createProjectUser);
projectUserRoutes.get("/:id", getProjectUser);
projectUserRoutes.put("/", updateProjectUser);
projectUserRoutes.delete("/", deleteProjectUser);

export { projectUserRoutes };
