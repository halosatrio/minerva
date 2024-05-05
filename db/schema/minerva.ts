import {
  text,
  index,
  timestamp,
  date,
  uuid,
  boolean,
  integer,
  pgSchema,
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("bebop");

export const habits = mySchema.table(
  "habits",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").notNull(),
    title: text("title").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    isActive: boolean("is_active").notNull(),
    startDate: date("start_date").notNull(),
    dailyGoal: integer("daily_goal").notNull(),
    weeklyGoal: integer("weekly_goal").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (expenses) => {
    return {
      userIdIndex: index("name_idx").on(expenses.userId),
    };
  }
);
