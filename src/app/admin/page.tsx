"use client";

import { Suspense, useEffect, useState } from "react";
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

const MotionTableRow = motion(TableRow);

export default function AdminPage() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const {
		data: users,
		isLoading: usersLoading,
		updateUser,
		isUpdating,
	} = useUsers();

	if (!mounted) return null;

	// Find the superadmin (lowest numeric id)
	const superAdmin =
		users && users.length > 0
			? users.reduce(
					(min, u) => (Number(u.id) < Number(min.id) ? u : min),
					users[0]
			  )
			: null;

	return (
		<main className="py-8">
			<div className="container mx-auto max-w-4xl">
				<h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>
				<div className="overflow-x-auto rounded-lg border bg-background shadow-2xl">
					<Suspense fallback={null}>
						{usersLoading ? null : (
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
									<AnimatePresence>
										{users?.map((u) => {
											const isSuperAdmin = !!(
												superAdmin && u.id === superAdmin.id
											);
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
															checked={u.is_active}
															disabled={isUpdating || isSuperAdmin}
															onCheckedChange={(checked) =>
																updateUser({ id: u.id, is_active: checked })
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
																		variant="accent"
																	/>
																</AlertDialogTrigger>
																<AlertDialogContent>
																	<AlertDialogHeader>
																		<AlertDialogTitle>
																			Change admin status?
																		</AlertDialogTitle>
																		<AlertDialogDescription>
																			Are you sure you want to{" "}
																			{u.isAdmin ? "remove" : "grant"} admin
																			rights for{" "}
																			<span className="font-semibold">
																				{u.email}
																			</span>
																			? This action can be reverted at any time.
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel>
																			Cancel
																		</AlertDialogCancel>
																		<AlertDialogAction
																			onClick={() =>
																				updateUser({
																					id: u.id,
																					is_admin: !u.isAdmin,
																				})
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
														{typeof u.tasksCount === "number"
															? u.tasksCount
															: 0}
													</TableCell>
												</MotionTableRow>
											);
										})}
									</AnimatePresence>
								</TableBody>
							</Table>
						)}
					</Suspense>
					{usersLoading && (
						<div className="py-12 flex justify-center">
							<SkeletonGrid
								rows={5}
								cols={4}
								itemHeight={40}
								className="my-8"
							/>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
