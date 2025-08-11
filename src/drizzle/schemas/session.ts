import { sessionStatus, deviceTypes, deviceBrowser, deviceOs } from "@/types/session";
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


