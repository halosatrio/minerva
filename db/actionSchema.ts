import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { habitsTable, usersTable } from "./schema";

// Schema for inserting a user - can be used to validate API requests
export const actionUserSchema = createInsertSchema(usersTable, {
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 character(s)" }),
});

export const createHabitReqSchema = createInsertSchema(habitsTable, {
  title: z.string(),
  icon: z.string(),
  color: z.string(),
  startDate: z.string(),
  dailyGoal: z.number(),
  weeklyGoal: z.number(),
});
