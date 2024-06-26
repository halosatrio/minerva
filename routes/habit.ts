import { Hono } from "hono";

import { db } from "../db";
import { habitsTable } from "../db/schema";
import { zValidator } from "@hono/zod-validator";
import { habitReqSchema } from "../db/actionSchema";
import type { JwtPayloadType } from "../types/common";
import { and, eq } from "drizzle-orm";
import { jwtMiddleware } from "../middleware/jwt";

export const habitRoutes = new Hono()
  // POST create-habit -> create habit by userid
  .post(
    "/create-habit",
    jwtMiddleware,
    zValidator("json", habitReqSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            status: 400,
            message: `Failed register user! [Errors]:${result.error.issues.map(
              (item) => " " + item.path[0] + ": " + item.message
            )}`,
          },
          400
        );
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

  // GET habits -> get all active habit by userid
  .get("/habits", jwtMiddleware, async (c) => {
    const jwtPayload: JwtPayloadType = c.get("jwtPayload");

    const habits = await db
      .select()
      .from(habitsTable)
      .where(
        and(
          eq(habitsTable.user_id, jwtPayload.sub),
          eq(habitsTable.is_active, true)
        )
      );

    if (habits.length < 1) {
      return c.json({ status: 200, message: "Success!", data: null });
    } else {
      return c.json({ status: 200, message: "Success!", data: habits });
    }
  })

  // GET habit/:id -> get habit by id
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
  })

  // PUT habit/:id -> edit habit by id
  .put(
    "/habit/:id{[0-9]+}",
    jwtMiddleware,
    zValidator("json", habitReqSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            status: 400,
            message: `Failed to update habit! [Errors]: ${result.error.issues
              .map((item) => `${item.path[0]}: ${item.message}`)
              .join(", ")}`,
          },
          400
        );
      }
    }),
    async (c) => {
      const jwtPayload: JwtPayloadType = c.get("jwtPayload");
      const id = Number.parseInt(c.req.param("id"));
      const body = c.req.valid("json");

      const existingHabit = await db
        .select()
        .from(habitsTable)
        .where(
          and(
            eq(habitsTable.user_id, jwtPayload.sub),
            eq(habitsTable.id, id),
            eq(habitsTable.is_active, true)
          )
        );

      if (existingHabit.length < 1) {
        return c.json({ status: 404, message: "Habit not found!" }, 404);
      }

      const updatedHabit = await db
        .update(habitsTable)
        .set({
          title: body.title,
          icon: body.icon,
          color: body.color,
          start_date: body.start_date,
          daily_goal: body.daily_goal,
          weekly_goal: body.weekly_goal,
          updated_at: new Date(),
        })
        .where(
          and(eq(habitsTable.user_id, jwtPayload.sub), eq(habitsTable.id, id))
        )
        .returning()
        .then((res) => res[0]);

      return c.json({
        status: 200,
        message: "Success updating habit!",
        data: updatedHabit,
      });
    }
  )

  // DELETE habit/:id -> SOFT DELETE habit by id
  .delete("/habit/:id{[0-9]+}", jwtMiddleware, async (c) => {
    const jwtPayload: JwtPayloadType = c.get("jwtPayload");
    const id = Number.parseInt(c.req.param("id"));

    const existingHabit = await db
      .select()
      .from(habitsTable)
      .where(
        and(
          eq(habitsTable.user_id, jwtPayload.sub),
          eq(habitsTable.id, id),
          eq(habitsTable.is_active, true)
        )
      );

    if (existingHabit.length < 1) {
      return c.json({ status: 404, message: "Habit not found!" }, 404);
    }

    const deleteHabit = await db
      .update(habitsTable)
      .set({
        is_active: false,
        updated_at: new Date(),
      })
      .where(
        and(eq(habitsTable.user_id, jwtPayload.sub), eq(habitsTable.id, id))
      )
      .returning()
      .then((res) => res[0]);

    return c.json({
      status: 200,
      message: "Success delete habit!",
      data: {
        id: deleteHabit.id,
        user_id: deleteHabit.user_id,
        title: deleteHabit.title,
        icon: deleteHabit.icon,
        color: deleteHabit.color,
        start_date: deleteHabit.start_date,
        daily_goal: deleteHabit.daily_goal,
        weekly_goal: deleteHabit.weekly_goal,
      },
    });
  });
