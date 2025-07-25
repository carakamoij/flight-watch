# Flight Price Watcher

A modern Next.js 15 application for monitoring Ryanair flight prices with email alerts via n8n webhooks. Built with TypeScript, Tailwind CSS, and designed for static export to GitHub Pages.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Email + Secret Authentication**: Secure client-side authentication with shared secret password
- **Real-time Price Monitoring**: Monitor specific flight routes and dates
- **Email Alerts**: Get notified via n8n workflows when prices drop below your threshold
- **Responsive Design**: Beautiful dark theme that works on all devices
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Form Validation**: React Hook Form with Zod validation and proper error handling
- **GitHub Pages Ready**: Static export for easy deployment

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4.x with custom dark theme
- **UI Components**: shadcn/ui with Radix UI primitives
- **Forms**: React Hook Form + @hookform/resolvers + Zod validation
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React hooks with localStorage persistence
- **Environment**: @t3-oss/env-nextjs for type-safe environment variables
- **Backend**: n8n webhooks for flight price monitoring and email alerts

## 📋 Prerequisites

- Node.js 18+ and npm
- n8n instance running (local or hosted)
- RapidAPI account with Ryanair3 API access (for n8n workflow)

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url> flight-watcher-n8n
cd flight-watcher-n8n
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# N8n Configuration
NEXT_PUBLIC_N8N_BASE_URL=https://your-n8n-instance.com
NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT=/webhook/ryanair-schedule
NEXT_PUBLIC_N8N_TASKS_ENDPOINT=/webhook/ryanair-tasks

# Authentication Secret (use a strong password)
NEXT_PUBLIC_APP_SECRET=your-very-secure-secret-password-here
```

### 3. n8n Workflow Setup

You need to set up n8n workflows with the following endpoints:

#### POST `/webhook/ryanair-schedule`

Creates or updates flight price monitoring tasks. Expected payload:

```json
{
	"email": "user@example.com",
	"origin": "Luqa",
	"destination": "Catania",
	"outboundDate": "2026-02-02",
	"returnDate": "2026-02-07",
	"priceThreshold": 25,
	"checkOutbound": true,
	"checkReturn": true,
	"currency": "EUR"
}
```

#### GET `/webhook/ryanair-tasks?email=user@example.com`

Returns array of active monitoring tasks for the user.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Deploy

### Local Development Build

```bash
npm run build        # Build for local testing
npm run deploy       # Build + create .nojekyll file
```

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Step 1: Enable GitHub Pages

1. Go to your repository settings: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings`
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**

#### Step 2: Configure Repository Secrets

Add these environment variables as repository secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each:

```
NEXT_PUBLIC_N8N_BASE_URL=https://your-n8n-instance.com
NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT=/webhook/ryanair-schedule
NEXT_PUBLIC_N8N_TASKS_ENDPOINT=/webhook/ryanair-tasks
NEXT_PUBLIC_APP_SECRET=your-secure-secret-password
```

#### Step 3: GitHub Actions Workflow

The project includes `.github/workflows/deploy.yml` with:

- **Automatic builds** on push to `master` branch
- **Environment variable injection** from repository secrets
- **Manual static export fallback** (required due to Next.js config conflicts)
- **Artifact upload** to GitHub Pages

#### Step 4: Custom Domain (Optional)

If using a custom domain:

1. Add your domain in repository **Settings** → **Pages** → **Custom domain**
2. Create a `CNAME` file in the `public/` directory with your domain
3. Configure DNS to point to GitHub Pages

#### Step 5: Deployment Verification

After pushing changes:

1. Check the **Actions** tab for build status
2. Site will be available at:
   - Default: `https://USERNAME.github.io/REPOSITORY/`
   - Custom domain: `https://your-custom-domain.com/`

#### Troubleshooting GitHub Pages

**Common Issues & Solutions:**

1. **Build fails with environment variable errors**
   ```bash
   # Check that all secrets are set correctly
   # Environment variables must start with NEXT_PUBLIC_
   ```

2. **No `out` directory created**
   ```bash
   # The workflow includes manual export fallback
   # Check Actions logs for "Manual static export completed"
   ```

3. **Config file conflicts**
   ```bash
   # Next.js may generate conflicting next.config.js
   # Workflow handles this automatically
   ```

4. **Custom domain not working**
   ```bash
   # Verify DNS settings
   # Check CNAME file in public/ directory
   # Wait for DNS propagation (up to 24 hours)
   ```

**Build Scripts:**

```bash
npm run build:github    # Build with GitHub Pages configuration
npm run deploy:github   # Build + deploy for GitHub Pages
```

## 🔐 Authentication

The app uses a simple but secure client-side authentication system:

- **Email + Secret Password**: Users enter their email and a shared secret password
- **Token Generation**: Creates a simple token (email + timestamp hash) stored in localStorage
- **Session Persistence**: 7-day automatic session expiry
- **Logout**: Clears localStorage token

This approach works perfectly for GitHub Pages deployment without requiring a backend.

## 🛡️ Security Considerations

- Secret password is stored in environment variables/GitHub secrets
- No sensitive data is stored client-side beyond the authentication token
- All business logic (price monitoring, email alerts) handled by n8n
- Environment variables are validated at build time with @t3-oss/env-nextjs

## 📁 Project Structure

```
flight-watcher-n8n/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles with Tailwind
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   └── page.tsx            # Main page component
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── flight-form.tsx     # Flight search form
│   │   ├── header.tsx          # App header with logout
│   │   └── login-form.tsx      # Authentication form
│   ├── lib/                    # Utility functions
│   │   ├── api.ts              # n8n API client
│   │   ├── auth.ts             # Authentication service
│   │   ├── data.ts             # Static data (airports)
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── utils.ts            # Utility functions
│   └── env.mjs                 # Environment variable validation
├── .env.example                # Environment variables template
├── .env.local                  # Local environment variables
├── components.json             # shadcn/ui configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── README.md                   # This file
```

## 🎨 UI Components & Patterns

The app follows modern React patterns with shadcn/ui:

### Form Handling Best Practices

```tsx
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

### Async Operations with Loading States

```tsx
const [isPending, startTransition] = useTransition();

const onSubmit = (data: FormData) => {
	startTransition(async () => {
		// Async operation
	});
};
```

## 🔗 API Integration

### Airport Data

Currently supports Malta ↔ Catania route:

- **Luqa (MLA)** ↔ **Catania (CTA)**
- Airport names (not IATA codes) used for RapidAPI compatibility

### n8n Workflow Requirements

- **Database**: Store task configurations locally in n8n
- **Scheduler**: Daily/hourly price checks via cron triggers
- **Email Service**: Gmail/SMTP for price drop alerts
- **RapidAPI**: Ryanair3 API for flight price data

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Check `.env.local` file exists and has correct format
   - Verify all variables start with `NEXT_PUBLIC_`
   - Restart development server after changes

2. **n8n Connection Errors**

   - Verify n8n instance is running and accessible
   - Check webhook URLs are correct
   - Test endpoints manually with curl/Postman

3. **Authentication Issues**
   - Verify secret password matches environment variable
   - Clear browser localStorage if token is corrupted
   - Check browser console for authentication errors

### Debug Mode

Set environment variable for additional logging:

```bash
SKIP_ENV_VALIDATION=false
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is for demonstration purposes. Please ensure compliance with airline terms of service when using for price monitoring.

## 🔮 Future Enhancements

- [ ] Support for additional airport routes
- [ ] Price history charts and analytics
- [ ] Multiple notification channels (SMS, Slack, etc.)
- [ ] Advanced filtering and search options
- [ ] Task management dashboard
- [ ] Bulk import/export of monitoring tasks
