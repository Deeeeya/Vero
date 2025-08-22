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
import { apiAuthenticator } from "../middlewares/api.middleware";

const projectAuthRoutes = new Hono();

projectAuthRoutes.post(
  "/signup",
  apiAuthenticator,
  zValidator("json", signUpSchema),
  signUp
);
projectAuthRoutes.post(
  "/signin",
  apiAuthenticator,
  zValidator("json", signInSchema),
  signIn
);
projectAuthRoutes.delete(
  "/signout",
  apiAuthenticator,
  projectAuthMiddleware,
  signOut
);
projectAuthRoutes.post("/refresh", apiAuthenticator, refreshToken);
projectAuthRoutes.post(
  "/reset-password",
  apiAuthenticator,
  projectAuthMiddleware,
  zValidator("json", resetPasswordSchema),
  resetPassword
);
projectAuthRoutes.post(
  "/forgot-password",
  apiAuthenticator,
  zValidator("json", forgotPasswordSchema),
  forgotPassword
);
projectAuthRoutes.post(
  "/reset-forgotten-password",
  apiAuthenticator,
  zValidator("json", resetForgottenPasswordSchema),
  resetForgottenPassword
);

export { projectAuthRoutes };
