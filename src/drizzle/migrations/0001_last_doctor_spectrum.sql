CREATE TYPE "public"."device_types" AS ENUM('web', 'mobile', 'desktop');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('active', 'expired');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"sessionToken" varchar(64) NOT NULL,
	"ipAddress" "inet" NOT NULL,
	"userAgent" text NOT NULL,
	"os" text NOT NULL,
	"browser" text NOT NULL,
	"deviceType" "device_types" NOT NULL,
	"deviceVendor" text NOT NULL,
	"deviceModel" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
