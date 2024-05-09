import bcrypt from "bcrypt";
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

      const validatedUser = actionUserSchema.parse(body);

      bcrypt.hash(validatedUser.password, 10, async function (err, hash) {
        if (!err) {
          console.log("FUKEN HERE", err, hash);
          let result = await db
            .insert(usersTable)
            .values({ email: validatedUser.email, password: hash })
            .returning()
            .then((res) => res[0]);

          return c.json({
            status: 200,
            message: "success register user!",
            data: result,
          });
        } else {
          return c.json({
            status: 500,
            message: "Failed register user! [Errors]: failed hased password!",
          });
        }
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

      const validatedUser = actionUserSchema.parse(body);

      const user = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          password: usersTable.password,
        })
        .from(usersTable)
        .where(eq(usersTable.email, validatedUser.email));

      console.log(user);

      if (user.length !== 0) {
        bcrypt.compare(
          validatedUser.password,
          user[0].password,
          function (err, result) {
            if (result === true) {
              console.log("hehe");
              return c.json({ status: 200, data: user });
            } else {
              return c.json({ status: 500, data: "password is incorrect!" });
            }
          }
        );
      } else {
        console.log("email is not found!");
        return c.json({ status: 500, data: "email is not found!" });
      }
      // return c.json({ status: 200, data: user });
    }
  );
