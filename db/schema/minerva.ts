import {
  text,
  index,
  timestamp,
  date,
  boolean,
  integer,
  pgSchema,
  smallint,
  serial,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("minerva");

export const users = mySchema.table("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const habits = mySchema.table(
  "habits",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    title: varchar("title", { length: 256 }).notNull(),
    icon: varchar("icon", { length: 256 }).notNull(),
    color: varchar("color", { length: 10 }).notNull(),
    isActive: boolean("is_active").default(true),
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

export const tracker = mySchema.table(
  "tracker",
  {
    date: date("date").notNull(),
    habitId: integer("habit_id").references(() => habits.id, {
      onDelete: "cascade",
    }),
    count: smallint("count").notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.date, table.habitId] }),
    };
  }
);
