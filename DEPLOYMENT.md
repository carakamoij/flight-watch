# 🚀 GitHub Pages Deployment - Quick Reference

## Copy-Paste Workflow Setup

### 1. Essential Files Structure

```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # ← Copy the entire deploy.yml from this repo
├── next.config.ts              # ← Must have output: "export"
├── package.json                # ← Must have build:github script
├── src/
│   └── env.mjs                 # ← Environment validation
└── public/
    └── .nojekyll               # ← Prevents Jekyll processing
```

### 2. Required GitHub Repository Secrets

```
Name: NEXT_PUBLIC_N8N_BASE_URL
Value: https://your-n8n-instance.com

Name: NEXT_PUBLIC_N8N_SCHEDULE_ENDPOINT
Value: /webhook/ryanair-schedule

Name: NEXT_PUBLIC_N8N_TASKS_ENDPOINT
Value: /webhook/ryanair-tasks

Name: NEXT_PUBLIC_APP_SECRET
Value: your-secure-password-123
```

### 3. Package.json Scripts

```json
{
	"scripts": {
		"build:github": "cross-env GITHUB_ACTIONS=true next build",
		"deploy:github": "npm run build:github && touch out/.nojekyll"
	}
}
```

### 4. Next.js Config (next.config.ts)

```typescript
import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	basePath: isGitHubPages ? "/your-repo-name" : "",
	assetPrefix: isGitHubPages ? "/your-repo-name/" : "",
};

export default nextConfig;
```

## 🔧 Workflow Explanation

### Why This Works

1. **Manual Export Fallback**: Handles Next.js config conflicts automatically
2. **Environment Variables**: Proper `NEXT_PUBLIC_*` naming for client-side access
3. **Cross-Platform**: Works on GitHub's Ubuntu runners and local Windows/Mac
4. **Error Recovery**: Builds static files even if automatic export fails

### Key Workflow Steps

```yaml
# 1. Build with environment variables from secrets
- name: Build with Next.js
  run: npm run build:github
  env:
    NEXT_PUBLIC_N8N_BASE_URL: ${{ secrets.NEXT_PUBLIC_N8N_BASE_URL }}
    # ... other secrets

# 2. Manual export fallback if needed
if [ ! -d "./out" ]; then
  mkdir -p out
  cp -r .next/static/* out/_next/static/
  # Copy HTML and public files
fi

# 3. Upload to GitHub Pages
- uses: actions/upload-pages-artifact@v3
  with:
    path: ./out
```

## 🚨 Common Pitfalls to Avoid

### ❌ **DON'T**

- Use secrets without `NEXT_PUBLIC_` prefix (won't work in client)
- Forget to enable GitHub Actions in Pages settings
- Mix up repository vs organization secrets
- Use relative paths in workflow scripts

### ✅ **DO**

- Set all 4 required secrets exactly as named
- Use the complete workflow file from this repo
- Enable GitHub Pages with "GitHub Actions" source
- Check Actions tab for build progress

## 🎯 Deployment Checklist

- [ ] Fork/clone repository
- [ ] Copy `.github/workflows/deploy.yml` exactly
- [ ] Set 4 repository secrets (Settings → Secrets → Actions)
- [ ] Enable GitHub Pages (Settings → Pages → GitHub Actions)
- [ ] Update `basePath` in `next.config.ts` to your repo name
- [ ] Push to master branch
- [ ] Check Actions tab for deployment progress
- [ ] Visit your GitHub Pages URL

**Result**: Automatic deployment on every push! 🎉
