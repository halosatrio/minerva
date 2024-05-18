import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export async function jwtMiddleware(c: Context, next: Next): Promise<any> {
  try {
    const authHeader = c.req.header("authorization");
    if (!authHeader)
      throw new HTTPException(401, { message: "TOKEN_IS_UNDEFINED" });

    const token = authHeader.split(" ")[1];
    if (!token) throw new HTTPException(401, { message: "TOKEN_IS_UNDEFINED" });

    const jwtSecret = process.env.SECRET_KEY;
    const user = await verify(token, jwtSecret!);
    c.set("user", user);
    return next();
  } catch (error: any) {
    if (error) {
      throw new HTTPException(error?.status, {
        message: error?.message,
        cause: error,
      });
    }
    throw new HTTPException(403, {
      message: "REQUIRE_AUTH_TOKEN_ERROR",
      cause: error,
    });
  }
}
