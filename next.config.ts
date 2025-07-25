import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	// For GitHub Pages deployment
	basePath: isGitHubPages ? "/flight-watcher-n8n" : "",
	assetPrefix: isGitHubPages ? "/flight-watcher-n8n/" : "",
};

export default nextConfig;
