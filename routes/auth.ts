import bcrypt from "bcrypt";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { users as userTable } from "../db/schema/minerva";
import { eq } from "drizzle-orm";

export const authRoutes = new Hono()
  .post("/register", async (c) => {
    return c.json({ message: "success create habit!" });
  })
  .post("/auth", async (c) => {
    const body = await c.req.json();

    const user = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        password: userTable.password,
      })
      .from(userTable)
      .where(eq(userTable.email, body.email));

    if (user.length !== 0) {
      bcrypt.compare(body.password, user[0].password, function (err, result) {
        if (result === true) {
          console.log("hehe");
          return c.json({ status: 200, data: user });
        } else {
          return c.json({ status: 500, data: "password is incorrect!" });
        }
      });
    } else {
      console.log("email is not found!");
      return c.json({ status: 500, data: "email is not found!" });
    }
    // return c.json({ status: 200, data: user });
  });
