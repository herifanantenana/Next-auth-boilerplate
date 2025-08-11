import {
	inet,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import * as z from "zod";

export const sessionStatus = ["active", "expired"] as const;
export const deviceTypes = ["web", "mobile", "desktop"] as const;

/* --------------------------------- drizzle -------------------------------- */

export const SessionStatusEnum = pgEnum("session_status", sessionStatus);
export const DeviceTypeEnum = pgEnum("device_types", deviceTypes);
export const SessionTable = pgTable("sessions", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid().notNull(),
	sessionToken: varchar({ length: 64 }).notNull().unique(),
	deviceType: DeviceTypeEnum().notNull(),
	ipAddress: inet().notNull(),
	userAgent: text().notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.defaultNow()
		.$onUpdateFn(() => new Date())
		.notNull(),
});

/* --------------------------------- schema --------------------------------- */

const S_B_Session = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	sessionToken: z.string().min(1).max(64),
	deviceType: z.enum(deviceTypes),
	ipAddress: z.ipv4().or(z.ipv6()),
	userAgent: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const S_Session = {
	insert: S_B_Session.omit({ id: true, createdAt: true, updatedAt: true }),
};

/* ---------------------------------- type ---------------------------------- */

export type T_SessionStatus = (typeof sessionStatus)[number];
export type T_DeviceType = (typeof deviceTypes)[number];
export type T_Session<T extends keyof typeof S_Session> = z.infer<
	(typeof S_Session)[T]
>;
