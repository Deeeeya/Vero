import { Hono } from "hono";
import { Variables } from "./types";

const app = new Hono<{ Variables: Variables }>();

export { app };
