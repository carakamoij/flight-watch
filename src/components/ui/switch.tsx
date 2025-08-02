"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
	"peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.4rem] w-10 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					// "data-[state=checked]:!bg-primary dark:data-[state=checked]:!bg-primary data-[state=unchecked]:!bg-input dark:data-[state=unchecked]:!bg-input/80", //doesn't work when used in alert dialog trigger.
					// & refers to the current element.
					// [aria-checked=true] is an attribute selector for the current element.
					// So [&[aria-checked=true]]:bg-primary means:
					// “Apply bg-primary when this element has aria-checked="true".”
					"[&[aria-checked=true]]:bg-primary [&[aria-checked=false]]:bg-input dark:[&[aria-checked=false]]:bg-input/80",
				accent:
					"data-[state=checked]:!bg-accent dark:data-[state=checked]:!bg-accent",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> &
	VariantProps<typeof switchVariants>;

function Switch({ className, variant, ...props }: SwitchProps) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(switchVariants({ variant, className }))}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%+calc(var(--spacing)))] data-[state=unchecked]:translate-x-[calc(var(--spacing))]"
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
