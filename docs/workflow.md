# Development and Production Workflow

## Environment Separation

This project maintains separate environments for development and production:

1. **Development Environment**:
   - Local development server
   - Development Convex deployment
   - Development Clerk application
   - Uses .env.local for environment variables

2. **Production Environment**:
   - Vercel deployment
   - Production Convex deployment
   - Production Clerk application with custom domain
   - Uses .env.production and Vercel environment variables

## Workflow Guidelines

### Development Process

1. **Local Development**:
   - Work with the development environment variables
   - Run `npm run dev` to start the local development server
   - Test features with the development Convex and Clerk instances

2. **Feature Development**:
   - Create feature branches from main
   - Use the development environment for testing
   - Run `npx convex dev` to deploy schema changes to development Convex

3. **Testing**:
   - Test all features thoroughly in the development environment
   - Ensure authentication flows work correctly
   - Verify Convex queries and mutations function as expected

### Deployment Process

1. **Preparing for Production**:
   - Merge feature branches to main after review
   - Update .env.production with production environment variables
   - Deploy schema changes to production Convex: `npx convex deploy`

2. **Deploying to Production**:
   - Push to main branch to trigger Vercel deployment
   - Or manually deploy: `vercel --prod`
   - Verify environment variables are correctly set in Vercel

3. **Post-Deployment Verification**:
   - Test the production application
   - Verify authentication works with production Clerk
   - Confirm Convex queries and mutations work in production

## Environment Variable Management

### Development Variables
- Store in .env.local (not committed to git)
- Include all necessary development keys and URLs

### Production Variables
- Store in .env.production (not committed to git)
- Also configure in Vercel dashboard for deployment
- Configure in Convex dashboard for backend functions

## Security Considerations

1. **Separation of Concerns**:
   - Keep development and production environments completely separate
   - Use different API keys and secrets for each environment

2. **Environment Variable Handling**:
   - Only expose necessary variables to the frontend (VITE_ prefix)
   - Keep sensitive keys in backend environments only
   - Never commit .env files to version control

3. **Access Control**:
   - Limit access to production environments
   - Use proper permissions in Convex schema
   - Configure authentication rules in Clerk

## Troubleshooting

### Common Issues

1. **Authentication Problems**:
   - Verify Clerk configuration and JWT templates
   - Check CLERK_SIGNING_KEY in Convex environment

2. **API Connection Issues**:
   - Confirm VITE_CONVEX_URL is correct for the environment
   - Verify CONVEX_DEPLOYMENT is set for production

3. **Environment Variable Mismatches**:
   - Ensure variables are consistent across platforms
   - Check for typos in variable names
