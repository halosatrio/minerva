import { Hono } from "hono";

import { db } from "../db";
import { habitsTable } from "../db/schema";

// import { createExpenseSchema } from "../sharedTypes";

export const habitRoutes = new Hono()
  .post("/create-habit", async (c) => {
    return c.json({ message: "success create habit!" });
  })
  .get("/habits", async (c) => {
    const habits = await db.select().from(habitsTable);

    return c.json({ data: habits });
  })
  .get("/habit/:id", async (c) => {
    return c.json({ habit: "hehehehehe" });
  });
