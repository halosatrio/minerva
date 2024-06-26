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

export const usersTable = mySchema.table("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const habitsTable = mySchema.table(
  "habits",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => usersTable.id, {
      onDelete: "cascade",
    }),
    title: varchar("title", { length: 256 }).notNull(),
    icon: varchar("icon", { length: 256 }).notNull(),
    color: varchar("color", { length: 10 }).notNull(),
    is_active: boolean("is_active").default(true),
    start_date: date("start_date").notNull(),
    daily_goal: integer("daily_goal").notNull(),
    weekly_goal: integer("weekly_goal").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (habits) => {
    return {
      userIdIndex: index("name_idx").on(habits.user_id),
    };
  }
);

export const trackerTable = mySchema.table(
  "tracker",
  {
    id: serial("id"),
    date: date("date").notNull(),
    habit_id: integer("habit_id")
      .notNull()
      .references(() => habitsTable.id, {
        onDelete: "cascade",
      }),
    count: smallint("count").notNull(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.date, table.habit_id] }),
    };
  }
);
