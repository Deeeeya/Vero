import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "../controllers/projectAuth.controller";
import { signInSchema, signUpSchema } from "../schemas/projectAuth.schema";
import { projectAuthMiddleware } from "../middlewares/projectAuth.middleware";

const projectAuthRoutes = new Hono();

projectAuthRoutes.post("/signup", zValidator("json", signUpSchema), signUp);
projectAuthRoutes.post("/signin", zValidator("json", signInSchema), signIn);
projectAuthRoutes.delete("/signout", projectAuthMiddleware, signOut);
projectAuthRoutes.post("/refresh", refreshToken);

export { projectAuthRoutes };
