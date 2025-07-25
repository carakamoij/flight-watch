import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts";
import "../env.mjs"; // Validate environment variables

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Flight Price Watcher",
	description:
		"Monitor Ryanair flight prices with email alerts via n8n webhooks",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-gradient font-sans min-h-screen antialiased`}
			>
				<AuthProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem={false}
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
