"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
	variant?: "primary" | "accent";
}

function Switch({
	className,
	variant = "primary",
	...props
}: SwitchProps) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				"peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.4rem] w-9 shrink-0 items-center rounded-full border border-transparent shadow-md transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
				variant === "primary" 
					? "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
					: "data-[state=checked]:bg-accent data-[state=unchecked]:bg-input",
				className
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"bg-background pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
