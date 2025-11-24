---
description: Clear deployment cache when updates don't show
---

# Clear Deployment Cache

Use this workflow when you've pushed code changes but they're not showing up in production (especially for specific components).

## Symptoms
- Code works in localhost but shows old version in deployment
- Some components update but others don't
- Browser shows cached version of specific files

## Solutions

### 1. Hard Refresh Browser (Try First)
**Mac:**
- Chrome/Edge: `Cmd + Shift + R`
- Safari: `Cmd + Option + R`

**Windows:**
- Chrome/Edge: `Ctrl + Shift + R`

**Advanced (Chrome/Edge):**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 2. Force New Deployment (If browser refresh doesn't work)

```bash
# Create an empty commit to trigger rebuild
git commit --allow-empty -m "Force rebuild - clear cache"

# Push to trigger new deployment
git push origin main
```

### 3. Clear Vercel Cache (If using Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → General
4. Scroll to "Build & Development Settings"
5. Click "Clear Cache"
6. Trigger a new deployment

### 4. Check Build ID (Prevention)
The `next.config.js` file now includes `generateBuildId` which creates unique build IDs to prevent caching issues. This should prevent most caching problems going forward.

## Common Causes
- CDN caching (Vercel, Netlify, etc.)
- Browser cache
- Service worker cache
- Build cache not invalidated
- Stale JavaScript bundles

## Prevention
✅ The project now has `generateBuildId` configured in `next.config.js`
✅ Each build gets a unique timestamp-based ID
✅ This forces fresh builds and prevents aggressive caching
