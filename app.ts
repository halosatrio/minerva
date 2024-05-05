import { Hono } from "hono";
import { logger } from "hono/logger";
import { habitRoutes } from "./routes/habit";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/", habitRoutes);

app.get("/api/test", (c) => {
  return c.json({ message: "Welcome aboard to Minerva!" });
});

export default app;
export type ApiRouts = typeof apiRoutes;
