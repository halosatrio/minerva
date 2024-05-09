import bcrypt from "bcrypt";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const authRoutes = new Hono()
  .post("/register", async (c) => {
    return c.json({ message: "success create habit!" });
  })
  .post("/auth", async (c) => {
    const body = await c.req.json();

    // TODO
    // validate body email is email

    const user = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, body.email));

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
