// import { bcrypt } from "bcrypt";
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
    // const habits = {
    //   hehe: "hehehe",
    // };

    const user = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        password: userTable.password,
      })
      .from(userTable);

    // bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
    //   // result == true
    // });
    const bcryptHash = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const isMatch = await Bun.password.verify(body.password, bcryptHash);

    console.log(body.password);
    console.log(user[0].password);
    console.log(isMatch);

    return c.json({ status: 200, data: body });
  });
