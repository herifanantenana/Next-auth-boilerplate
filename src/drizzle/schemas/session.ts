import { env } from "@/lib/env/server";
import {
	deviceBrowser,
	deviceOs,
	deviceTypes,
	sessionStatus,
} from "@/types/session";
import { relations } from "drizzle-orm";
import {
	foreignKey,
	inet,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { UserTable } from "./user";


/* ---------------------------------- ENUM ---------------------------------- */

export const SessionStatusEnum = pgEnum("session_status", sessionStatus);
export const DeviceTypeEnum = pgEnum("device_types", deviceTypes);
export const DeviceBrowserEnum = pgEnum("device_browser", deviceBrowser);
export const DeviceOsEnum = pgEnum("device_os", deviceOs);

/* ______________ TABLE _____________ */

export const SessionTable = pgTable(
	"sessions",
	{
		id: uuid().defaultRandom().notNull(),
		userId: uuid().notNull(),
		sessionToken: varchar({ length: 64 }).notNull().unique(),
		sessionStatus: SessionStatusEnum().default("active").notNull(),
		ipAddress: inet().notNull(),
		userAgent: text().notNull(),
		deviceOs: DeviceOsEnum().default("unknwon").notNull(),
		deviceBrowser: DeviceBrowserEnum().default("unknwon").notNull(),
		deviceType: DeviceTypeEnum().default("unknwon").notNull(),
		deviceVendor: text().notNull(),
		deviceModel: text().notNull(),
		expiredAt: timestamp({ withTimezone: true }).default(
			new Date(Date.now() + env.SESSION_EXPIRATION_SECONDS * 1000),
		).notNull(),
		createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp({ withTimezone: true })
			.defaultNow()
			.$onUpdateFn(() => new Date())
			.notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.id],
		}),
		foreignKey({
			name: "user_fk",
			columns: [table.userId],
			foreignColumns: [UserTable.id],
		})
			.onDelete("cascade")
			.onUpdate("cascade"),
	],
);

/* ____________ RELATION ____________ */

export const SessionRelation = relations(SessionTable, ({ one }) => ({
	user: one(UserTable),
}));
