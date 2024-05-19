import { Hono } from "hono";

import { db } from "../db";
import { habitsTable } from "../db/schema";
import { zValidator } from "@hono/zod-validator";
import { createHabitReqSchema } from "../db/actionSchema";
import type { JwtPayloadType } from "../types/common";
import { and, eq } from "drizzle-orm";
import { jwtMiddleware } from "../middleware/jwt";

export const habitRoutes = new Hono()
  .post(
    "/create-habit",
    jwtMiddleware,
    zValidator("json", createHabitReqSchema, (result, c) => {
      if (!result.success) {
        return c.json({
          status: 400,
          message: `Failed register user! [Errors]:${result.error.issues.map(
            (item) => " " + item.path[0] + ": " + item.message
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
          user_id: jwtPayload.sub,
          title: body.title,
          icon: body.icon,
          color: body.color,
          start_date: body.start_date,
          daily_goal: body.daily_goal,
          weekly_goal: body.weekly_goal,
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

  .get("/habits", jwtMiddleware, async (c) => {
    const jwtPayload: JwtPayloadType = c.get("jwtPayload");

    const habits = await db
      .select()
      .from(habitsTable)
      .where(eq(habitsTable.user_id, jwtPayload.sub));

    if (habits.length < 1) {
      return c.json({ status: 200, message: "Success!", data: null });
    } else {
      return c.json({ status: 200, message: "Success!", data: habits });
    }
  })

  .get("/habit/:id{[0-9]+}", jwtMiddleware, async (c) => {
    const jwtPayload: JwtPayloadType = c.get("jwtPayload");
    const id = Number.parseInt(c.req.param("id"));

    const habit = await db
      .select()
      .from(habitsTable)
      .where(
        and(eq(habitsTable.user_id, jwtPayload.sub), eq(habitsTable.id, id))
      );

    if (habit.length < 1) {
      return c.json({ status: 200, message: "Success!", data: null });
    } else {
      return c.json({ status: 200, message: "Success!", data: habit[0] });
    }
  });
