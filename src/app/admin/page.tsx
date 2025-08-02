"use client";

import { useUsers } from "@/hooks";
import { Switch } from "@/components/ui/switch";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { SkeletonGrid } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { startTransition } from "react";
import { N8nResponse } from "@/lib/types";

const MotionTableRow = motion.create(TableRow);

export default function AdminPage() {
	// const [mounted, setMounted] = useState(false);
	// useEffect(() => {
	// 	setMounted(true);
	// }, []);

	const {
		data: users,
		isLoading: usersLoading,
		isError: usersError,
		updateUser,
		isUpdating, // isUpdating is a boolean indicating if the update mutation is in progress still works.
	} = useUsers();

	//const usersLoading = true;
	//if (!mounted) return null;

	// Find the superadmin (lowest numeric id)
	const superAdmin =
		users && users.length > 0
			? users.reduce(
					(min, u) => (Number(u.id) < Number(min.id) ? u : min),
					users[0]
			  )
			: null;

	async function handleUpdateUser(mutation: Promise<N8nResponse>) {
		startTransition(async () => {
			try {
				const response = await mutation;
				if (response.success) {
					toast.success("Successfully updated user!");
				} else {
					toast.error("Failed to update user. Please try again later.");
				}
			} catch (error: unknown) {
				const message =
					error instanceof Error
						? error.message
						: typeof error === "string"
						? error
						: "Failed to update user. Please try again later.";
				toast.error(message);
			}
		});
	}

	return (
		<main className="py-8">
			<div className="container mx-auto max-w-4xl">
				<h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>
				<div className="overflow-x-auto rounded-lg border bg-background shadow-2xl">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-left p-4">Email</TableHead>
								<TableHead className="text-center p-4">Active</TableHead>
								<TableHead className="text-center p-4">Admin</TableHead>
								<TableHead className="text-center p-4">Tasks</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<AnimatePresence mode="wait">
								{usersLoading && (
									<MotionTableRow
										key="loading-row"
										initial={{ opacity: 0.5, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										transition={{ duration: 0.2 }}
									>
										<TableCell colSpan={4}>
											<SkeletonGrid
												rows={2}
												cols={4}
												itemHeight={30}
												className="my-4"
											/>
										</TableCell>
									</MotionTableRow>
								)}
								{users?.map((u) => {
									const isSuperAdmin = !!(superAdmin && u.id === superAdmin.id);
									return (
										<MotionTableRow
											key={u.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.2 }}
										>
											<TableCell className="p-3.5 flex gap-2 align-middle">
												{u.email}
												{isSuperAdmin && (
													<span className="ml-2 px-2 py-0.5 rounded bg-primary text-xs text-primary-foreground font-semibold">
														Superadmin
													</span>
												)}
											</TableCell>
											<TableCell className="text-center p-3 align-middle">
												<Switch
													checked={u.isActive}
													disabled={isUpdating || isSuperAdmin}
													onCheckedChange={(checked) =>
														handleUpdateUser(
															updateUser({
																id: u.id,
																is_active: checked,
																is_admin: null,
															})
														)
													}
												/>
											</TableCell>
											<TableCell className="text-center p-3 align-middle">
												{isSuperAdmin ? (
													<Switch checked={u.isAdmin} disabled />
												) : (
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Switch
																checked={u.isAdmin}
																disabled={isUpdating}
																onCheckedChange={() => {}}
																// variant="accent"
															/>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Change admin status?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to{" "}
																	{u.isAdmin ? "remove" : "grant"} admin rights
																	for{" "}
																	<span className="font-semibold">
																		{u.email}
																	</span>
																	? This action can be reverted at any time.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() =>
																		handleUpdateUser(
																			updateUser({
																				id: u.id,
																				is_admin: !u.isAdmin,
																				is_active: null, // Keep current active status
																			})
																		)
																	}
																>
																	Confirm
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												)}
											</TableCell>
											<TableCell className="text-center font-mono p-3 align-middle">
												{typeof u.tasksCount === "number" ? u.tasksCount : 0}
											</TableCell>
										</MotionTableRow>
									);
								})}
							</AnimatePresence>
						</TableBody>
					</Table>
					{usersError && (
						<div className="p-4 text-red-500">
							<p>Error loading users. Please try again later.</p>
						</div>
					)}
					{!usersLoading && !usersError && users?.length === 0 && (
						<div className="p-4 text-gray-500">
							<p>No users found.</p>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
