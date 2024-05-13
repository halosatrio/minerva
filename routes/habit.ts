import { Hono } from "hono";
import { jwt } from "hono/jwt";

import { db } from "../db";
import { habitsTable } from "../db/schema";

const secret = process.env.SECRET_KEY;

export const habitRoutes = new Hono()
  .post("/create-habit", jwt({ secret: secret! }), async (c) => {
    const payload = c.get("jwtPayload");
    return c.json({ message: "success create habit!", data: payload });
  })

  .get("/habits", async (c) => {
    const habits = await db.select().from(habitsTable);

    return c.json({ data: habits });
  })
  .get("/habit/:id", async (c) => {
    return c.json({ habit: "hehehehehe" });
  });
