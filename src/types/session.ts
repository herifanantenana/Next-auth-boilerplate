import z from "zod";
import { userRoles } from "./user";

/* ____________ CONSTANT ____________ */
export const sessionStatus = ["active", "expired"] as const;
export const deviceTypes = ["mobile", "desktop", "tablet", "unknwon"] as const;
export const deviceBrowser = [
	"chrome",
	"firefox",
	"safari",
	"edge",
	"opera",
	"unknwon",
] as const;
export const deviceOs = [
	"windows",
	"macos",
	"linux",
	"android",
	"ios",
	"unknwon",
] as const;

/* _____________ SCHEMA _____________ */
const S_B_Session = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	sessionToken: z.string().min(1).max(64),
	sessionStatus: z.enum(sessionStatus),
	ipAddress: z.ipv4().or(z.ipv6()),
	userAgent: z.string().min(1),
	deviceOs: z.enum(deviceOs).default("unknwon"),
	deviceBrowser: z.enum(deviceBrowser).default("unknwon"),
	deviceType: z.enum(deviceTypes).default("unknwon"),
	deviceVendor: z.string().min(1).default("unknwon"),
	deviceModel: z.string().min(1).default("unknwon"),
	expiredAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const S_Session = {
	insert: S_B_Session.omit({
		id: true,
		expiredAt: true,
		createdAt: true,
		updatedAt: true,
	}),
	deviceInfo: S_B_Session.pick({
		userAgent: true,
		ipAddress: true,
		deviceOs: true,
		deviceBrowser: true,
		deviceType: true,
		deviceVendor: true,
		deviceModel: true,
	}),
	insertRedis: S_B_Session.pick({
		userId: true,
		sessionToken: true,
		expiredAt: true,
	}).extend({
		sessionId: z.uuid(),
		userRole: z.enum(userRoles)
	}),
};

/* ______________ TYPE ______________ */

export type T_SessionStatus = (typeof sessionStatus)[number];
export type T_DeviceType = (typeof deviceTypes)[number];
export type T_DeviceBrowser = (typeof deviceBrowser)[number];
export type T_DeviceOS = (typeof deviceOs)[number];
export type T_Session<T extends keyof typeof S_Session> = z.infer<
	(typeof S_Session)[T]
>;
