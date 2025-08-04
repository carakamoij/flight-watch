import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	width?: string | number;
	height?: string | number;
	rounded?: string;
	className?: string;
}

export function Skeleton({
	width,
	height,
	rounded = "md",
	className,
	...props
}: SkeletonProps) {
	return (
		<div
			className={cn(
				"animate-pulse bg-muted",
				rounded && `rounded-${rounded}`,
				className
			)}
			style={{ width, height, ...props.style }}
			{...props}
		/>
	);
}

interface SkeletonGridProps {
	rows?: number;
	cols?: number;
	itemWidth?: string | number;
	itemHeight?: string | number;
	gap?: string;
	className?: string;
}

export function SkeletonGrid({
	rows = 3,
	cols = 3,
	itemWidth = "100%",
	itemHeight = 32,
	gap = "1",
	className,
}: SkeletonGridProps) {
	return (
		<div className={cn(`grid gap-${gap} grid-cols-${cols}`, className)}>
			{Array.from({ length: rows * cols }).map((_, i) => (
				<Skeleton key={i} width={itemWidth} height={itemHeight} />
			))}
		</div>
	);
}

// For lists (vertical)
interface SkeletonListProps {
	items?: number;
	itemHeight?: string | number;
	gap?: string;
	className?: string;
}

export function SkeletonList({
	items = 5,
	itemHeight = 32,
	gap = "0.75rem",
	className,
}: SkeletonListProps) {
	return (
		<div className={cn(`flex flex-col gap-${gap}`, className)}>
			{Array.from({ length: items }).map((_, i) => (
				<Skeleton key={i} width="100%" height={itemHeight} />
			))}
		</div>
	);
}
