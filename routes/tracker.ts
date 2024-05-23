import { Hono } from "hono";
import { jwtMiddleware } from "../middleware/jwt";
import { db } from "../db";
import { trackerTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { postTrackerReqSchema } from "../db/actionSchema";

export const tracker = new Hono()

  // GET /tracker/:id -> get tracker records by habit id
  .get("/tracker/:id{[0-9]+}", jwtMiddleware, async (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const trackers = await db
      .select()
      .from(trackerTable)
      .where(and(eq(trackerTable.habit_id, id)));

    if (trackers.length < 1) {
      return c.json({ status: 404, message: "Habit is not found!" }, 404);
    } else {
      return c.json({ status: 200, message: "Success!", data: trackers });
    }
  })

  // POST /tracker -> to record a habit being tracked
  .post(
    "/tracker/:id{[0-9]+}",
    jwtMiddleware,
    zValidator("json", postTrackerReqSchema, (result, c) => {
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
      const id = Number.parseInt(c.req.param("id"));
      const body = c.req.valid("json");

      const trackerByHabitId = await db
        .select()
        .from(trackerTable)
        .where(eq(trackerTable.habit_id, id));

      if (trackerByHabitId.length < 1) {
        return c.json(
          { status: 404, message: "Habit tracker is not found!" },
          404
        );
      }

      const res = await db
        .insert(trackerTable)
        .values({
          habit_id: id,
          date: body.date,
          count: 1,
          updated_at: new Date(),
        })
        .returning()
        .then((res) => res[0]);

      return c.json({ status: 200, data: res }, 200);
    }
  );
