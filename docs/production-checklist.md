# Production Environment Configuration Checklist

## Domain Setup
- [x] Purchase custom domain (flock.center)
- [x] Configure DNS records in GoDaddy
- [x] Set up domain forwarding in GoDaddy
- [ ] Wait for DNS propagation (can take up to 24 hours)
- [ ] Validate domain configuration in Clerk

## Clerk Configuration
- [x] Create production instance in Clerk
- [x] Configure authentication providers (Google, Twitter)
- [x] Set Issuer URL to https://clerk.flock.center
- [x] Configure JWT settings for Convex integration
- [ ] Add redirect URLs for your production domain
- [ ] Update VITE_CLERK_PUBLISHABLE_KEY in Vercel environment variables

## Convex Configuration
- [x] Update auth.config.ts with production Clerk domain
- [x] Deploy updated auth configuration to Convex
- [x] Configure CLERK_SIGNING_KEY in Convex environment variables
- [ ] Set up authentication provider in production Convex deployment

## Vercel Configuration
- [x] Deploy application to Vercel
- [x] Configure environment variables in Vercel:
  - [x] VITE_CLERK_PUBLISHABLE_KEY (from production Clerk instance)
  - [x] CONVEX_DEPLOYMENT (production Convex deployment ID)
  - [x] VITE_CONVEX_URL (production Convex URL)
  - [x] VITE_BASE_PATH (if using a custom path)
  - [x] VITE_TEMPO (for Tempo integration)

## Testing
- [ ] Test authentication flow in production
- [ ] Verify Convex queries and mutations work
- [ ] Test campaign creation and management
- [ ] Verify Twitter integration works in production

## Post-Deployment
- [ ] Set up monitoring
- [ ] Configure error tracking
- [ ] Set up analytics
- [ ] Create backup strategy for Convex data

## Security
- [ ] Enable HTTPS for all endpoints
- [ ] Review authentication permissions
- [ ] Ensure sensitive environment variables are properly secured
- [ ] Set up proper CORS configuration
