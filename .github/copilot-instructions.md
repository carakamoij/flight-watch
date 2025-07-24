# Copilot Instructions for flight-watcher-n8n

## Project Overview

- This is a Next.js 15 app (App Router, TypeScript, Tailwind) for monitoring Ryanair flight prices and scheduling alerts via n8n webhooks.
- The app is designed for static export and deployment to GitHub Pages. No backend server is required.
- All business logic (flight price checks, scheduling, email alerts) is handled by n8n workflows, not in the app.

## Architecture & Data Flow

- **Frontend**: Next.js (src/app, src/components, Tailwind CSS)
- **API Integration**: Communicates with n8n via webhooks (see env vars)
- **Authentication**: Email + secret password + token (localStorage); no backend auth
- **Task Management**: App POSTs to `/webhook/ryanair-schedule` to create/update tasks; GETs from `/webhook/ryanair-tasks` to fetch tasks for a user
- **Airports**: Airport names (not IATA codes) are used; list may be fetched from n8n or hardcoded

## Key Files & Patterns

- `src/app/` — Next.js App Router entrypoints
- `src/components/` — UI components (many are shadcn/ui or Radix-based)
- `src/lib/` — Utility functions, API clients, and types
- `src/data/` — (Optional) Static data, e.g., airport lists
- `.env` — Use `@t3-oss/env-nextjs` for type-safe env vars
- `README.md` — Contains setup, deployment, and n8n integration details

## Developer Workflows

- **Dev server**: `npm run dev`
- **Build static site**: `npm run build && npm run export`
- **Deploy to GitHub Pages**: `npm run deploy` (see README for details)
- **Update env vars**: Edit `.env` and update types in `env.mjs` if needed
- **Update n8n endpoints**: Change env vars, not hardcoded URLs

## Conventions & Patterns

- Use `type` for data models (e.g., `type Task = { ... }`)
- All API calls use fetch with endpoints from env vars
- Prefer functional React components and hooks
- Use Tailwind for all styling; avoid CSS modules
- All business logic (scheduling, email, price checks) is offloaded to n8n
- No server-side code or API routes in Next.js

## Form Handling Best Practices

- Use React Hook Form with shadcn/ui FormField components
- Use FormControl wrapper instead of destructuring register
- Implement startTransition for loading states and optimistic updates
- Follow this pattern:

```typescript
<FormField
	control={form.control}
	name="fieldName"
	render={({ field }) => (
		<FormItem>
			<FormLabel>Label</FormLabel>
			<FormControl>
				<Input {...field} />
			</FormControl>
			<FormMessage />
		</FormItem>
	)}
/>
```

## Authentication System

- Email + shared secret password (stored in env vars/GitHub secrets)
- Generate simple token (email + timestamp hash) for localStorage
- Session validation without server-side auth
- Logout clears localStorage token

## Integration Points

- **n8n Webhooks**: All data flows through n8n endpoints; see `.env` for base URL and routes
- **RapidAPI**: n8n workflow calls Ryanair3 API; app does not call RapidAPI directly
- **GitHub Pages**: App must be exportable as static HTML

## Examples

- To create a task: POST to `${N8N_BASE_URL}${N8N_SCHEDULE_ENDPOINT}` with task data
- To fetch tasks: GET from `${N8N_BASE_URL}${N8N_TASKS_ENDPOINT}?email=...`

## Special Notes

- Do not add server-side code or Next.js API routes
- Do not use IATA codes for airports unless n8n endpoint supports it
- All authentication is client-only (email + secret password + token)
- Use FormControl pattern for all form inputs, avoid destructuring register
- Always use startTransition for form submissions and async operations
- Keep all configuration in env vars and document in README
