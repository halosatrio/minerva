import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

export const authRoutes = new Hono()
  .post("/register", async (c) => {
    return c.json({ message: "success create habit!" });
  })
  .post("/auth", async (c) => {
    const habits = {
      hehe: "hehehe",
    };

    return c.json({ data: habits });
  });
