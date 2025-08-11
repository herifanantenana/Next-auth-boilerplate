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

const sessionStatus = ["active", "expired"] as const;
const deviceTypes = ["mobile", "desktop", "tablet", "unknwon"] as const;
const deviceBrowser = [
	"chrome",
	"firefox",
	"safari",
	"edge",
	"opera",
	"unknwon",
] as const;
const deviceOs = [
	"windows",
	"macos",
	"linux",
	"android",
	"ios",
	"unknwon",
] as const;

/* --------------------------------- drizzle -------------------------------- */

export const SessionStatusEnum = pgEnum("session_status", sessionStatus);
export const DeviceTypeEnum = pgEnum("device_types", deviceTypes);
export const DeviceBrowserEnum = pgEnum("device_browser", deviceBrowser);
export const DeviceOsEnum = pgEnum("device_os", deviceOs);

export const SessionTable = pgTable("sessions", {
	id: uuid().primaryKey().defaultRandom(),
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
	sessionStatus: z.enum(sessionStatus),
	ipAddress: z.ipv4().or(z.ipv6()),
	userAgent: z.string().min(1),
	deviceOs: z.enum(deviceOs),
	deviceBrowser: z.enum(deviceBrowser),
	deviceType: z.enum(deviceTypes),
	deviceVendor: z.string().min(1),
	deviceModel: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const S_Session = {
	insert: S_B_Session.omit({ id: true, createdAt: true, updatedAt: true }),
};

/* ---------------------------------- type ---------------------------------- */

export type T_SessionStatus = (typeof sessionStatus)[number];
export type T_DeviceType = (typeof deviceTypes)[number];
export type T_DeviceBrowser = (typeof deviceBrowser)[number];
export type T_DeviceOS = (typeof deviceOs)[number];
export type T_Session<T extends keyof typeof S_Session> = z.infer<
	(typeof S_Session)[T]
>;
