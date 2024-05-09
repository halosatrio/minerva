CREATE SCHEMA "minerva";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "minerva"."habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar(256) NOT NULL,
	"icon" varchar(256) NOT NULL,
	"color" varchar(10) NOT NULL,
	"is_active" boolean DEFAULT true,
	"start_date" date NOT NULL,
	"daily_goal" integer NOT NULL,
	"weekly_goal" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "minerva"."tracker" (
	"date" date NOT NULL,
	"habit_id" integer,
	"count" smallint NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "tracker_date_habit_id_pk" PRIMARY KEY("date","habit_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "minerva"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "minerva"."habits" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "minerva"."habits" ADD CONSTRAINT "habits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "minerva"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "minerva"."tracker" ADD CONSTRAINT "tracker_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "minerva"."habits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
