"use client";

import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/hooks";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) return router.push("/dashboard");
	}, [isLoading, isAuthenticated, router]);

	// if (isLoading) return <AppLoading />; //DO NOT USE.
	if (isAuthenticated) return null;

	return <LoginForm />;
}
