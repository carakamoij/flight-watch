"use client";
import { useAuthQuery } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeRedirect() {
	const { isAuthenticated } = useAuthQuery();
	const router = useRouter();
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		if (isAuthenticated === true) {
			router.replace("/dashboard");
		} else if (isAuthenticated === false) {
			router.replace("/login");
		}
		setTimeout(() => setChecking(false), 300); //avoid flash of empty page.
	}, [isAuthenticated, router]);

	if (checking) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<span className="text-muted-foreground text-lg">Redirecting...</span>
			</div>
		);
	}

	return null;
}
