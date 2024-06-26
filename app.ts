import { Hono } from "hono";
import { logger } from "hono/logger";
import { habitRoutes } from "./routes/habit";
import { authRoutes } from "./routes/auth";
import { tracker as trackerRoute } from "./routes/tracker";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
  })
);

const apiRoutes = app
  .basePath("/api")
  .route("/", habitRoutes)
  .route("/", authRoutes)
  .route("/", trackerRoute);

app.get("/api/test", (c) => {
  return c.json({ message: "Welcome aboard to Minerva!" });
});

export default app;
export type ApiRouts = typeof apiRoutes;
