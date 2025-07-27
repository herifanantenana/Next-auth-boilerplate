CREATE TYPE "public"."providers" AS ENUM('google', 'github', 'discord');--> statement-breakpoint
CREATE TABLE "oauth_accounts" (
	"userId" uuid NOT NULL,
	"provider" "providers" NOT NULL,
	"providerAccountId" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_accounts_userId_providerAccountId_pk" PRIMARY KEY("userId","providerAccountId")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "salt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;