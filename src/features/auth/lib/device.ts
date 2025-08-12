import { S_Session } from "@/types/session";
import { NextRequest } from "next/server";
import { UAParser } from "ua-parser-js";

export const getDeviceInfo = (req: NextRequest) => {
	const userAgent = req.headers.get("user-agent") || "";
	const ip =
		req.headers.get("x-forwarded-for") ||
		req.headers.get("x-real-ip") ||
		"0.0.0.0";
	const parserUa = new UAParser(userAgent);
	const browser = parserUa.getBrowser();
	const os = parserUa.getOS();
	const device = parserUa.getDevice();
	// console.log({
	// 	userAgent,
	// 	ipAddress: ip,
	// 	deviceOs: os.name?.toLowerCase(),
	// 	deviceBrowser: browser.name?.toLowerCase(),
	// 	deviceType: device.type?.toLowerCase(),
	// 	deviceVendor: device.vendor?.toLowerCase(),
	// 	deviceModel: device.model?.toLowerCase(),
	// });

	return S_Session.deviceInfo.safeParse({
		userAgent,
		ipAddress: ip,
		deviceOs: os.name?.toLowerCase(),
		deviceBrowser: browser.name?.toLowerCase(),
		deviceType: device.type?.toLowerCase(),
		deviceVendor: device.vendor?.toLowerCase(),
		deviceModel: device.model?.toLowerCase(),
	});
};
