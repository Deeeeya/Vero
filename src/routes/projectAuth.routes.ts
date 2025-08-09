import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signIn, signOut, signUp } from "../controllers/projectAuth.controller";
import { signInSchema, signUpSchema } from "../schemas/projectAuth.schema";

const projectAuthRoutes = new Hono();

projectAuthRoutes.post("/signup", zValidator("json", signUpSchema), signUp);
projectAuthRoutes.post("/signin", zValidator("json", signInSchema), signIn);
projectAuthRoutes.delete("/signout", signOut);

export { projectAuthRoutes };
