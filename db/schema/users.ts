import { text, timestamp, pgSchema, serial } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("minerva");

export const users = mySchema.table("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});
