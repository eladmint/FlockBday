# Clerk Setup Guide

## Development Environment

### Platform Configuration (Your Tasks)
- [ ] Create a development Clerk application
- [ ] Configure authentication providers (Google, Twitter, etc.)
- [ ] Set up JWT templates for Convex
- [ ] Configure redirect URLs:
  - [ ] Home URL: http://localhost:5173
  - [ ] Sign in URL: http://localhost:5173/sign-in
  - [ ] Sign up URL: http://localhost:5173/sign-up
  - [ ] After sign in URL: http://localhost:5173/dashboard
  - [ ] After sign up URL: http://localhost:5173/dashboard

### Code/Terminal Configuration (AI Tasks)
- [ ] Install Clerk packages: `npm install @clerk/clerk-react`
- [ ] Add Clerk publishable key to .env.local: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`
- [ ] Set up ClerkProvider in main.tsx
- [ ] Configure ConvexProviderWithClerk

## Production Environment

### Platform Configuration (Your Tasks)
- [ ] Create a production Clerk application
- [ ] Configure authentication providers (Google, Twitter, etc.)
- [ ] Set up JWT templates for Convex
- [ ] Configure custom domain (clerk.flock.center)
- [ ] Configure redirect URLs:
  - [ ] Home URL: https://flock.center
  - [ ] Sign in URL: https://flock.center/sign-in
  - [ ] Sign up URL: https://flock.center/sign-up
  - [ ] After sign in URL: https://flock.center/dashboard
  - [ ] After sign up URL: https://flock.center/dashboard

### Code/Terminal Configuration (AI Tasks)
- [ ] Add Clerk publishable key to .env.production: `VITE_CLERK_PUBLISHABLE_KEY=pk_live_...`
- [ ] Update auth.config.ts with production domain

## Required Environment Variables

| Variable | Development | Production | Where to Set |
|----------|-------------|------------|---------------|
| VITE_CLERK_PUBLISHABLE_KEY | ✅ | ✅ | .env.local / .env.production / Vercel |

## Security Notes
- Only use the publishable key (pk_*) in frontend code
- Never include the Clerk secret key in frontend code or version control
- JWT templates should be configured to only include necessary claims
- Set appropriate session token lifetimes
