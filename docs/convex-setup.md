# Convex Setup Guide

## Development Environment

### Platform Configuration (Your Tasks)
- [ ] Create a development Convex project
- [ ] Set up authentication provider in Convex dashboard
- [ ] Configure environment variables in Convex dashboard:
  - [ ] CLERK_SIGNING_KEY (from Clerk development instance)
  - [ ] FRONTEND_URL (http://localhost:5173)
  - [ ] STRIPE_SECRET_KEY (if using Stripe)
  - [ ] STRIPE_WEBHOOK_SECRET (if using Stripe)

### Code/Terminal Configuration (AI Tasks)
- [ ] Install Convex CLI: `npm install -g convex`
- [ ] Initialize Convex in project: `npx convex init`
- [ ] Deploy schema: `npx convex dev`
- [ ] Update auth.config.ts with development Clerk domain
- [ ] Add Convex URL to .env.local: `VITE_CONVEX_URL=your_dev_convex_url`

## Production Environment

### Platform Configuration (Your Tasks)
- [ ] Create a production Convex project
- [ ] Set up authentication provider in Convex dashboard
- [ ] Configure environment variables in Convex dashboard:
  - [ ] CLERK_SIGNING_KEY (from Clerk production instance)
  - [ ] FRONTEND_URL (https://flock.center)
  - [ ] STRIPE_SECRET_KEY (if using Stripe)
  - [ ] STRIPE_WEBHOOK_SECRET (if using Stripe)

### Code/Terminal Configuration (AI Tasks)
- [ ] Deploy to production: `npx convex deploy`
- [ ] Add Convex URL to .env.production: `VITE_CONVEX_URL=your_prod_convex_url`
- [ ] Add Convex deployment ID to .env.production: `CONVEX_DEPLOYMENT=your_prod_deployment_id`

## Required Environment Variables

| Variable | Development | Production | Where to Set |
|----------|-------------|------------|---------------|
| CLERK_SIGNING_KEY | ✅ | ✅ | Convex Dashboard |
| FRONTEND_URL | ✅ | ✅ | Convex Dashboard |
| STRIPE_SECRET_KEY | ✅ | ✅ | Convex Dashboard |
| STRIPE_WEBHOOK_SECRET | ✅ | ✅ | Convex Dashboard |
| VITE_CONVEX_URL | ✅ | ✅ | .env.local / .env.production / Vercel |
| CONVEX_DEPLOYMENT | ❌ | ✅ | .env.production / Vercel |

## Security Notes
- Never store CLERK_SIGNING_KEY in frontend code or version control
- Only the VITE_CONVEX_URL is needed on the frontend
- All sensitive operations should be performed in Convex functions
- Use proper access controls in your schema.ts file
