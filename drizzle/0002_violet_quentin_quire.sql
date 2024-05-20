ALTER TABLE "minerva"."tracker" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "minerva"."tracker" ALTER COLUMN "updated_at" DROP NOT NULL;