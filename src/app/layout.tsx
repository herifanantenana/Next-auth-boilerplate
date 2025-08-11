import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const Rubik = localFont({
	src: "../../public/fonts/Rubik-VariableFont_wght.ttf",
	variable: "--font-rubik",
	display: "swap",
	style: "normal",
	weight: "100 200 300 400 500 600 700 800 900",
});

const Arvo = localFont({
	src: "../../public/fonts/Arvo-Regular.ttf",
	variable: "--font-arvo",
	display: "swap",
	style: "normal",
	weight: "400",
});

export const metadata: Metadata = {
	title: "Next Auth Boilerplate",
	description: "A boilerplate for Next.js with scratch authentication",
	icons: {
		icon: "/user.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${Rubik.variable} ${Arvo.variable} antialiased`}>
				<main className="p-10">{children}</main>
				<Toaster expand visibleToasts={3} position="top-center" id="global" richColors />
			</body>
		</html>
	);
}
