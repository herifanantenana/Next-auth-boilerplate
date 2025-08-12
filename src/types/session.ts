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
	id: z.uuid({ message: "Invalid UUID for id" }),
	userId: z.uuid({ message: "Invalid UUID for userId" }),
	sessionToken: z.string().min(1, { message: "Session token is required" }).max(64, { message: "Session token must be at most 64 characters" }),
	sessionStatus: z.enum(sessionStatus, { message: "Invalid session status" }),
	ipAddress: z.ipv4({ message: "Invalid IPv4 address" }).or(z.ipv6({ message: "Invalid IPv6 address" })),
	userAgent: z.string().min(1, { message: "User agent is required" }),
	deviceOs: z.enum(deviceOs, { message: "Invalid device OS" }).default("unknwon"),
	deviceBrowser: z.enum(deviceBrowser, { message: "Invalid device browser" }).default("unknwon"),
	deviceType: z.enum(deviceTypes, { message: "Invalid device type" }).default("unknwon"),
	deviceVendor: z.string().min(1, { message: "Device vendor is required" }).default("unknwon"),
	deviceModel: z.string().min(1, { message: "Device model is required" }).default("unknwon"),
	expiredAt: z.date({ message: "Invalid expiredAt date" }),
	createdAt: z.date({ message: "Invalid createdAt date" }),
	updatedAt: z.date({ message: "Invalid updatedAt date" }),
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
