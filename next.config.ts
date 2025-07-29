import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	allowedDevOrigins: [
		// GitHub
		"github.com",
		"*.github.com",

		// Discord
		"discord.com",
		"*.discord.com",
		"discordapp.com",
		"*.discordapp.com",
	],
};

export default nextConfig;
