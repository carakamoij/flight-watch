"use client";
import { easeInOut, motion } from "framer-motion";

import React, { useEffect, useState } from "react";

// Removed digitVariants and replaced with direct animate/transition props

const messageVariants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0, transition: { delay: 1, duration: 1 } },
};

export default function NotFound() {
	// Animation states: 'fall', 'rotate', 'glimmer'
	const [animState, setAnimState] = useState<"fall" | "rotate" | "glimmer">(
		"fall"
	);

	useEffect(() => {
		const rotateDelay = 400;
		const glimmerDelay = rotateDelay + 1800;
		const rotateTimeout = setTimeout(() => setAnimState("rotate"), rotateDelay);
		const glimmerTimeout = setTimeout(
			() => setAnimState("glimmer"),
			glimmerDelay
		);
		return () => {
			clearTimeout(rotateTimeout);
			clearTimeout(glimmerTimeout);
		};
	}, []);

	return (
		<div className="flex flex-col items-center justify-start min-h-screen mt-[25vh] text-center">
			<div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-8 h-[6rem] md:h-[10rem]">
				{[4, 0, 4].map((digit, i) => {
					const initial = { y: -200, opacity: 0, rotateX: 0 };
					let animate, transition;
					if (animState === "fall") {
						animate = { y: 0, opacity: 1 };
						transition = { duration: 0.5 + i * 0.3, ease: easeInOut };
					} else {
						animate = {
							color: ["#3b82f6", "#60a5fa", "#3b82f6"],
							y: 0,
							opacity: 1,
							rotateZ: [0, 360],
						};
						transition = {
							repeat: Infinity,
							duration: 2,
							ease: easeInOut,
						};
					}
					return (
						<motion.span
							key={i}
							className={
								"text-5xl md:text-9xl font-extrabold text-primary relative perspective-1000" +
								(animState === "glimmer" ? " animate-gli" : "")
							}
							style={{ display: "inline-block", perspective: 1000 }}
							initial={initial}
							animate={animate}
							transition={transition}
						>
							{digit}
						</motion.span>
					);
				})}
			</div>
			<motion.p
				className="text-muted-foreground mb-4 text-base md:text-lg px-2"
				variants={messageVariants}
				initial="initial"
				animate="animate"
			>
				Oops! The page you are looking for does not exist or you do not have
				access.
			</motion.p>
		</div>
	);
}
