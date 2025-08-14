import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  forgotPassword,
  refreshToken,
  resetForgottenPassword,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "../controllers/projectAuth.controller";
import {
  forgotPasswordSchema,
  resetForgottenPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../schemas/projectAuth.schema";
import { projectAuthMiddleware } from "../middlewares/projectAuth.middleware";

const projectAuthRoutes = new Hono();

projectAuthRoutes.post("/signup", zValidator("json", signUpSchema), signUp);
projectAuthRoutes.post("/signin", zValidator("json", signInSchema), signIn);
projectAuthRoutes.delete("/signout", projectAuthMiddleware, signOut);
projectAuthRoutes.post("/refresh", refreshToken);
projectAuthRoutes.post(
  "/reset-password",
  projectAuthMiddleware,
  zValidator("json", resetPasswordSchema),
  resetPassword
);
projectAuthRoutes.post(
  "/forgot-password",
  zValidator("json", forgotPasswordSchema),
  forgotPassword
);
projectAuthRoutes.post(
  "/reset-forgotten-password",
  zValidator("json", resetForgottenPasswordSchema),
  resetForgottenPassword
);

export { projectAuthRoutes };
