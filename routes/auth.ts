import { sign } from "hono/jwt";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { actionUserSchema } from "../db/actionSchema";

export const authRoutes = new Hono()
  .post(
    "/register",
    zValidator("json", actionUserSchema, (result, c) => {
      console.log("midle", result);
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
      const body = c.req.valid("json");

      const bcryptHash = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      let res = await db
        .insert(usersTable)
        .values({ email: body.email, password: bcryptHash })
        .returning()
        .then((res) => res[0]);

      return c.json({
        status: 200,
        message: "success register user!",
        data: res,
      });
    }
  )

  .post(
    "/auth",
    zValidator("json", actionUserSchema, (result, c) => {
      if (!result.success) {
        return c.json({
          status: 400,
          message: `Login failed! [Errors]:${result.error.issues.map(
            (item) => " " + item.message
          )}`,
        });
      }
    }),
    async (c) => {
      const body = c.req.valid("json");

      const user = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          password: usersTable.password,
        })
        .from(usersTable)
        .where(eq(usersTable.email, body.email));

      if (user.length !== 0) {
        const isMatch = await Bun.password.verify(
          body.password,
          user[0].password
        );

        // GENERATE JWT (token)
        const secret = process.env.SECRET_KEY;
        const tokenPayload = {
          sub: body.id,
          email: body.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
        };
        const token = await sign(tokenPayload, secret!);

        if (isMatch) {
          return c.json({ status: 200, message: "Success!", data: token });
        } else {
          return c.json({ status: 500, data: "password is incorrect!" });
        }
      } else {
        return c.json({ status: 500, data: "email is not found!" });
      }
    }
  );
