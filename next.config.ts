import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	// For GitHub Pages deployment
	basePath: process.env.NODE_ENV === "production" ? "/flight-watcher-n8n" : "",
	assetPrefix:
		process.env.NODE_ENV === "production" ? "/flight-watcher-n8n/" : "",
};

export default nextConfig;
