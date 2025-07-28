import type { User } from "../lib/types";

export const mockUsers: User[] = [
	{
		id: "1",
		email: "danielbonello92@gmail.com",
		is_active: true,
		isAdmin: true,
		tasksCount: 5,
		created_at: "2025-07-01T12:00:00Z",
		updated_at: "2025-07-20T12:00:00Z",
	},
	{
		id: "2",
		email: "user1@example.com",
		is_active: true,
		isAdmin: false,
		tasksCount: 2,
		created_at: "2025-07-02T12:00:00Z",
		updated_at: "2025-07-21T12:00:00Z",
	},
	{
		id: "3",
		email: "user2@example.com",
		is_active: false,
		isAdmin: false,
		tasksCount: 0,
		created_at: "2025-07-03T12:00:00Z",
		updated_at: "2025-07-22T12:00:00Z",
	},
];
