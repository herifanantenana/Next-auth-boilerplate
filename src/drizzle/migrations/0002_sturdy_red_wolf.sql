CREATE TYPE "public"."device_browser" AS ENUM('chrome', 'firefox', 'safari', 'edge', 'opera', 'unknwon');--> statement-breakpoint
CREATE TYPE "public"."device_os" AS ENUM('windows', 'macos', 'linux', 'android', 'ios', 'unknwon');--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "os" TO "deviceOs";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "deviceType" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "deviceType" SET DEFAULT 'unknwon'::text;--> statement-breakpoint
DROP TYPE "public"."device_types";--> statement-breakpoint
CREATE TYPE "public"."device_types" AS ENUM('mobile', 'desktop', 'tablet', 'unknwon');--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "deviceType" SET DEFAULT 'unknwon'::"public"."device_types";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "deviceType" SET DATA TYPE "public"."device_types" USING "deviceType"::"public"."device_types";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "sessionStatus" "session_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "deviceBrowser" "device_browser" DEFAULT 'unknwon' NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "browser";