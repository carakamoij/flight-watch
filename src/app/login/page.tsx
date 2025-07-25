"use client";

import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks";
import AppLoading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) return <AppLoading />;
	if (isAuthenticated) return null;

	return <LoginForm />;
}
