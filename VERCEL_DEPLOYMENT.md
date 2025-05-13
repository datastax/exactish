# Deploying to Vercel

This guide explains how to deploy the Exactish app to Vercel while maintaining the existing Netlify deployment.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- SendGrid account with API key
- Git repository with your code

## Setup Steps

### 1. Install Vercel CLI (Already Done)

The Vercel CLI is already installed as a dev dependency in this project. You can use it with:

```bash
npm run vercel-dev  # For local development
```

### 2. Configure Environment Variables

When deploying to Vercel, you'll need to set the following environment variables:

**Required Variables:**
- `SENDGRID_API_KEY`: Your SendGrid API key
- `SENDGRID_FROM_EMAIL`: Verified sender email for SendGrid
- `SENDGRID_REPLY_EMAIL`: Reply-to email address
- `VITE_LANGFLOW_API_BASE_URL`: Langflow API URL
- `VITE_LANGFLOW_FLOW_ID`: Your Langflow flow ID
- `VITE_LANGFLOW_IMAGE_COMPONENT_KEY`: The image component key

**Optional Variables:**
- `SENDGRID_ENABLE_MARKETING`: Set to "true" to enable adding contacts to your list
- `VITE_PLATFORM`: Set to "vercel" to force using Vercel endpoints (not needed if auto-detection works)

### 3. Deploy to Vercel

You can deploy to Vercel in two ways:

#### Option 1: Using Vercel CLI

```bash
# Login to Vercel
npx vercel login

# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod
```

#### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add the environment variables listed above
6. Click "Deploy"

## How Platform Detection Works

The app automatically detects whether it's running on Netlify or Vercel based on the hostname:

1. If `VITE_PLATFORM` is set to "netlify" or "vercel", it will use that platform's endpoints
2. Otherwise, it checks if the hostname contains "vercel.app" to detect Vercel
3. If neither condition is met, it defaults to Netlify

## Testing Your Deployment

After deploying to Vercel:

1. Visit your Vercel deployment URL
2. Upload an image and process it
3. Enter your email for notifications
4. Verify that the email is sent correctly
5. Check SendGrid to see if the contact was added to your list (if enabled)

## Troubleshooting

If you encounter issues with the Vercel deployment:

1. Check the Vercel deployment logs in the Vercel dashboard
2. Verify that all environment variables are set correctly
3. Make sure your SendGrid API key has the necessary permissions
4. If using contact lists, ensure `SENDGRID_ENABLE_MARKETING` is set to "true"

For API permission issues, you may need to create a new SendGrid API key with "Marketing > Contacts" permissions.
