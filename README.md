# Veliano Jewelry E-commerce

A custom jewelry e-commerce platform specializing in custom grillz, built with Next.js 15, TypeScript, and Supabase.

## Current Status

The project is in Phase 1: Fix Current Issues. We are actively working on:

1. Fixing 404 errors on navigation paths
2. Resolving Vercel deployment issues

See [Project Plan](.cursor/project-plan.md) for detailed roadmap.

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone <repository-url>
cd veliano
npm install
```

Copy the environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your own values.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utility functions and business logic
- `types/` - TypeScript type definitions
- `public/` - Static assets
- `scripts/` - Utility scripts and automation tools
- `.cursor/` - Documentation and project guidelines

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint the codebase
- `npm run test` - Run tests

### Utility Scripts

The project includes several utility scripts to help with development:

- `scripts/check-navigation.js` - Identify potential 404 errors by scanning routes and links

To run a utility script:

```bash
node scripts/check-navigation.js
```

## Testing Navigation

To debug 404 errors and navigation issues:

1. Run the navigation check script:
   ```bash
   node scripts/check-navigation.js
   ```

2. Review the generated report in `reports/navigation-check.json`

3. Check the tracker file `.cursor/navigation-issues.md` for status of fixes

## Deployment

The project is deployed on Vercel. For deployment instructions, see [Deployment Guide](.cursor/DEPLOY.md).

To check deployment issues:

1. Review Vercel deployment logs in the Vercel dashboard
2. Use the [Vercel Deployment Checklist](.cursor/vercel-deployment-checklist.md) to systematically fix issues

## Tech Stack

- **Frontend**: Next.js 15 App Router
- **Styling**: shadcn/ui with Tailwind CSS
- **Data Fetching**: Server Components and Server Actions
- **Database**: Supabase (pending integration in Phase 2)
- **Authentication**: Supabase Auth (pending integration in Phase 2)
- **Payment Processing**: Stripe (pending integration in Phase 3)

## Documentation

- [Project Plan](.cursor/project-plan.md) - Overall project roadmap
- [Deployment Guide](.cursor/DEPLOY.md) - Deployment procedures
- [Navigation Issues Tracker](.cursor/navigation-issues.md) - 404 issues tracking
- [Vercel Deployment Checklist](.cursor/vercel-deployment-checklist.md) - Deployment issue tracking
- [Admin Portal Documentation](README-ADMIN-PORTAL.md) - Admin portal documentation
