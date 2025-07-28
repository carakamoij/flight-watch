import React from "react";
import clsx from "clsx";

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
			className={clsx(
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
	gap = "1rem",
	className,
}: SkeletonGridProps) {
	return (
		<div
			className={clsx("grid", className)}
			style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap }}
		>
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
		<div
			className={className}
			style={{ display: "flex", flexDirection: "column", gap }}
		>
			{Array.from({ length: items }).map((_, i) => (
				<Skeleton key={i} width="100%" height={itemHeight} />
			))}
		</div>
	);
}
