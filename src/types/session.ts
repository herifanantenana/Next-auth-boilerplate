import z from "zod";

/* -------------------------------- constant -------------------------------- */

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
