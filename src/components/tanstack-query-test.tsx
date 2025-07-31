// This file has been removed as it is no longer used in the new context-based auth flow.
"use client";

import { useAuth, useTasks } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function TanStackQueryTest() {
	const queryClient = useQueryClient();
	const { user, isAuthenticated, login, logout, isLoading } = useAuth();
	const {
		data: tasks,
		isLoading: tasksLoading,
		error: tasksError,
		dataUpdatedAt,
		isFetching,
	} = useTasks(user?.email);
	const [logs, setLogs] = useState<string[]>([]);

	const handleTestLogin = async () => {
		try {
			addLog("🔄 Starting login...");
			await login({
				email: "test@example.com",
				secretKey: process.env.NEXT_PUBLIC_APP_SECRET || "test",
				pin: "1234",
			});
			addLog("✅ Login successful - auth cache updated!");
		} catch (error) {
			addLog("❌ Login failed: " + (error as Error).message);
			console.error("Login failed:", error);
		}
	};

	const handleLogout = () => {
		addLog("🔄 Logging out...");
		logout();
		addLog("✅ Logout complete - all caches cleared!");
	};

	const addLog = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
	};

	const handleInvalidateAuth = () => {
		addLog("🔄 Manually invalidating auth cache...");
		queryClient.invalidateQueries({ queryKey: ["auth"] });
		addLog("✅ Auth cache invalidated!");
	};

	const handleInvalidateTasks = () => {
		addLog("🔄 Manually invalidating tasks cache...");
		queryClient.invalidateQueries({ queryKey: ["tasks"] });
		addLog("✅ Tasks cache invalidated!");
	};

	return (
		<div className="p-6 space-y-4 bg-card rounded-lg border">
			<h2 className="text-xl font-semibold">
				TanStack Query Cache Invalidation Test
			</h2>

			{/* Auth State */}
			<div className="space-y-2">
				<h3 className="font-medium">Auth State:</h3>
				<p>Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
				<p>User: {user?.email || "None"}</p>
				<p>Loading: {isLoading ? "🔄 Yes" : "❌ No"}</p>
				<p>
					Last Updated:{" "}
					{dataUpdatedAt
						? new Date(dataUpdatedAt).toLocaleTimeString()
						: "Never"}
				</p>
			</div>

			{/* Auth Actions */}
			<div className="flex gap-2 flex-wrap">
				<Button onClick={handleTestLogin} disabled={isLoading}>
					{isLoading ? "Logging in..." : "Test Login"}
				</Button>
				<Button onClick={handleLogout} variant="outline">
					Logout
				</Button>
				<Button onClick={handleInvalidateAuth} variant="secondary" size="sm">
					Invalidate Auth Cache
				</Button>
			</div>

			{/* Tasks Query */}
			{isAuthenticated && (
				<div className="space-y-2">
					<h3 className="font-medium">Tasks Query:</h3>
					<p>Loading: {tasksLoading ? "🔄 Yes" : "❌ No"}</p>
					<p>Fetching: {isFetching ? "🔄 Yes" : "❌ No"}</p>
					<p>Error: {tasksError ? `❌ ${tasksError.message}` : "✅ None"}</p>
					<p>Tasks Count: {tasks?.length || 0}</p>
					<Button onClick={handleInvalidateTasks} variant="secondary" size="sm">
						Invalidate Tasks Cache
					</Button>
				</div>
			)}

			{/* Cache Invalidation Logs */}
			<div className="space-y-2">
				<h3 className="font-medium">Cache Invalidation Log:</h3>
				<div className="bg-muted p-3 rounded text-sm font-mono max-h-40 overflow-y-auto">
					{logs.length === 0 ? (
						<p className="text-muted-foreground">
							No events yet. Try logging in/out to see cache invalidation!
						</p>
					) : (
						logs.map((log, index) => (
							<div key={index} className="mb-1">
								{log}
							</div>
						))
					)}
				</div>
			</div>

			{/* Instructions */}
			<div className="text-sm text-muted-foreground space-y-1">
				<p>
					💡 <strong>Watch for cache invalidation:</strong>
				</p>
				<ul className="list-disc list-inside space-y-1 ml-4">
					<li>Open React Query DevTools (floating logo)</li>
					<li>Login/logout and watch queries update in real-time</li>
					<li>Notice how tasks query starts/stops based on auth state</li>
					<li>Use manual invalidation buttons to see immediate refetching</li>
				</ul>
			</div>
		</div>
	);
}
