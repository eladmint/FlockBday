# Vercel Setup Guide

## Development Environment

### Platform Configuration (Your Tasks)
- [ ] No specific Vercel configuration needed for development

### Code/Terminal Configuration (AI Tasks)
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Link project: `vercel link`

## Production Environment

### Platform Configuration (Your Tasks)
- [ ] Create a new Vercel project
- [ ] Connect to your GitHub repository
- [ ] Configure custom domain (flock.center)
- [ ] Set up environment variables in Vercel dashboard:
  - [ ] VITE_CLERK_PUBLISHABLE_KEY (from Clerk production instance)
  - [ ] VITE_CONVEX_URL (from Convex production deployment)
  - [ ] CONVEX_DEPLOYMENT (from Convex production deployment)
  - [ ] VITE_FRONTEND_URL (https://flock.center)

### Code/Terminal Configuration (AI Tasks)
- [ ] Create vercel.json for routing configuration
- [ ] Deploy to Vercel: `vercel --prod`

## Required Environment Variables

| Variable | Development | Production | Where to Set |
|----------|-------------|------------|---------------|
| VITE_CLERK_PUBLISHABLE_KEY | ❌ | ✅ | Vercel Dashboard |
| VITE_CONVEX_URL | ❌ | ✅ | Vercel Dashboard |
| CONVEX_DEPLOYMENT | ❌ | ✅ | Vercel Dashboard |
| VITE_FRONTEND_URL | ❌ | ✅ | Vercel Dashboard |

## Security Notes
- Environment variables set in Vercel are encrypted and secure
- Only include variables with the VITE_ prefix in client-side code
- Use Vercel's preview environments for testing before production
- Enable Vercel's security headers for production deployments
