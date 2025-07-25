import { HeaderClient } from "@/components/header-client";

import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<section className="min-h-screen w-full">
			<HeaderClient />
			{children}
		</section>
	);
}
