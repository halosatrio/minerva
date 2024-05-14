import { Hono } from "hono";
import { jwt } from "hono/jwt";

import { db } from "../db";
import { habitsTable } from "../db/schema";
import { zValidator } from "@hono/zod-validator";
import { createHabitReqSchema } from "../db/actionSchema";
import type { JwtPayloadType } from "../types/common";

const secret = process.env.SECRET_KEY;

export const habitRoutes = new Hono()
  .post(
    "/create-habit",
    jwt({ secret: secret! }),
    zValidator("json", createHabitReqSchema, (result, c) => {
      if (!result.success) {
        return c.json({
          status: 400,
          message: `Failed register user! [Errors]:${result.error.issues.map(
            (item) => " " + item.message
          )}`,
        });
      }
    }),
    async (c) => {
      const jwtPayload: JwtPayloadType = c.get("jwtPayload");
      const body = c.req.valid("json");

      let res = await db
        .insert(habitsTable)
        .values({
          userId: jwtPayload.sub,
          title: body.title,
          icon: body.icon,
          color: body.color,
          startDate: body.startDate,
          dailyGoal: body.dailyGoal,
          weeklyGoal: body.weeklyGoal,
        })
        .returning()
        .then((res) => res[0]);

      return c.json({
        status: 200,
        message: "success create habit!",
        data: res,
      });
    }
  )

  .get("/habits", async (c) => {
    const habits = await db.select().from(habitsTable);

    return c.json({ data: habits });
  })
  .get("/habit/:id", async (c) => {
    return c.json({ habit: "hehehehehe" });
  });
