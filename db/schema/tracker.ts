import {
  timestamp,
  date,
  integer,
  pgSchema,
  smallint,
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("bebop");

export const habits = mySchema.table("tracker", {
  date: date("date").notNull(),
  habitId: integer("habit_id"),
  count: smallint("count").notNull(),
  updatedAt: timestamp("updated_at"),
});
