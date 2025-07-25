"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AppLoading() {
	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.span
				animate={{ rotate: 360 }}
				transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
			>
				<Loader2 className="h-8 w-8 text-primary animate-spin" />
			</motion.span>
			<span className="ml-4 text-lg text-primary">Loading...</span>
		</motion.div>
	);
}
