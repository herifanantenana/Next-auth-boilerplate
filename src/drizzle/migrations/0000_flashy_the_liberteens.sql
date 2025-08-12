CREATE TYPE "public"."device_browser" AS ENUM('chrome', 'firefox', 'safari', 'edge', 'opera', 'unknwon');--> statement-breakpoint
CREATE TYPE "public"."device_os" AS ENUM('windows', 'macos', 'linux', 'android', 'ios', 'unknwon');--> statement-breakpoint
CREATE TYPE "public"."device_types" AS ENUM('mobile', 'desktop', 'tablet', 'unknwon');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('active', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"sessionToken" varchar(64) NOT NULL,
	"sessionStatus" "session_status" DEFAULT 'active' NOT NULL,
	"ipAddress" "inet" NOT NULL,
	"userAgent" text NOT NULL,
	"deviceOs" "device_os" DEFAULT 'unknwon' NOT NULL,
	"deviceBrowser" "device_browser" DEFAULT 'unknwon' NOT NULL,
	"deviceType" "device_types" DEFAULT 'unknwon' NOT NULL,
	"deviceVendor" text NOT NULL,
	"deviceModel" text NOT NULL,
	"expiredAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"isVerified" timestamp with time zone,
	"username" varchar(255) NOT NULL,
	"fullname" varchar(255),
	"password" varchar(255),
	"salt" varchar(255),
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "user_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;