"use client";

import { RegisterForm } from "@/components/register-form";
import { useAuth } from "@/hooks";
// import AppLoading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) return router.push("/dashboard");
	}, [isAuthenticated, router]);

	// if (isLoading) return <AppLoading />;
	if (isAuthenticated) return null;

	return <RegisterForm />;
}
