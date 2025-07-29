import { relations } from "drizzle-orm";
import {
	foreignKey,
	pgEnum,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import * as z from "zod";
import { UserTable } from "./user";

export const providerOAuthEnum = ["google", "github", "discord"] as const;
export type TProviderOAuth = (typeof providerOAuthEnum)[number];
export const ProviderOAuthEnum = pgEnum("providers", providerOAuthEnum);

export const OAuthAccountTable = pgTable(
	"oauth_accounts",
	{
		userId: uuid().notNull(),
		provider: ProviderOAuthEnum().notNull(),
		providerAccountId: varchar({ length: 256 }).notNull(),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.providerAccountId] }),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [UserTable.id],
		})
			.onDelete("cascade")
			.onUpdate("cascade"),
	],
);

export const OAuthAccountRelation = relations(OAuthAccountTable, ({ one }) => ({
	user: one(UserTable),
}));

const SOAuthAccountSchema = z.object({
	userId: z.uuid(),
	provider: z.enum(providerOAuthEnum),
	providerAccountId: z.string().min(1).max(256),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const SBaseOAuthAccountSchema = {
	insert: SOAuthAccountSchema.omit({ createdAt: true, updatedAt: true }),
};

export type TBaseOAuthAccount<T extends keyof typeof SBaseOAuthAccountSchema> =
	z.infer<(typeof SBaseOAuthAccountSchema)[T]>;
