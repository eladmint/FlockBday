# Setting Up Clerk Authentication in Convex Production Environment

## Step 1: Configure Authentication Provider in Convex Production

1. Go to your Convex dashboard and select your **Production** deployment (currently showing "majestic-magpie-833")
2. Navigate to **Settings** → **Authentication** in the left sidebar
3. Click on the **Learn more** link or the **Configure Authentication** button
4. Select **Clerk** as your authentication provider
5. Enter the following details:
   - **Domain**: `https://clerk.flock.center` (your production Clerk domain)
   - **Application ID**: `convex` (must match the value in your auth.config.ts)
6. Click **Save** to apply the configuration

## Step 2: Verify Environment Variables

1. While still in your Production deployment settings, go to **Environment Variables**
2. Make sure the `CLERK_SIGNING_KEY` is set with the value from your production Clerk instance
3. If not present, add it with the signing key from your Clerk production JWT template

## Step 3: Deploy Updated Configuration

After configuring the authentication provider in the Convex dashboard, deploy your changes:

```bash
npx convex deploy
```

## Step 4: Verify Configuration

After deployment, refresh the Authentication page in your Convex dashboard. You should now see your Clerk domain listed as a configured authentication provider, similar to your development environment.

## Troubleshooting

If authentication still doesn't work after configuration:

1. Verify that your auth.config.ts file has the correct production domain
2. Check that the JWT template in Clerk is properly configured with "convex" as the application ID
3. Ensure the CLERK_SIGNING_KEY in Convex matches the one from your Clerk JWT template
4. Confirm that your frontend is using the correct production Clerk publishable key
