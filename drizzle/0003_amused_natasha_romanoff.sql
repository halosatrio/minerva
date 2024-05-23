ALTER TABLE "minerva"."tracker" ALTER COLUMN "habit_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "minerva"."tracker" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "minerva"."tracker" ALTER COLUMN "updated_at" SET NOT NULL;