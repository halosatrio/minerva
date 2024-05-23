import { z } from "zod";

// Schema for inserting a user - can be used to validate API requests
export const actionUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 character(s)" }),
});

export const habitReqSchema = z.object({
  title: z.string(),
  icon: z.string(),
  color: z.string(),
  start_date: z.string().date(),
  daily_goal: z.number(),
  weekly_goal: z.number(),
});

export const postTrackerReqSchema = z.object({
  date: z.string().date(),
});
