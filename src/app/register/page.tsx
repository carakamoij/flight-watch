"use client";

import { RegisterForm } from "@/components/register-form";
import { useAuth } from "@/hooks";
import AppLoading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) return <AppLoading />;
	if (isAuthenticated) return null;

	return <RegisterForm />;
}
