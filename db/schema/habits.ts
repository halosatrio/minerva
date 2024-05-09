import {
  text,
  timestamp,
  date,
  boolean,
  integer,
  pgSchema,
  serial,
  index,
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("bebop");

export const habits = mySchema.table(
  "habits",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    title: text("title").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    isActive: boolean("is_active").notNull(),
    startDate: date("start_date").notNull(),
    dailyGoal: integer("daily_goal").notNull(),
    weeklyGoal: integer("weekly_goal").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (habits) => {
    return {
      userIdIndex: index("name_idx").on(habits.userId),
    };
  }
);
