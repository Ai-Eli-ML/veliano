# Migration Plan: Next.js 15 + shadcn/ui
# Don't use any legacy or deprecated dependancies, remove them and find options via searching the web

## Phase 1: Setup and Preparation
1. Create backup branch
   - Create a new branch `feat/next15-shadcn-migration`
   - Push current state to backup branch

2. Update Next.js and Core Dependencies
   - Update Next.js to version 15
   - Update React to latest compatible version
   - Update TypeScript and other core dependencies
   - Test basic application functionality
   - Don't use any legacy or deprecated dependancies

3. Install shadcn/ui
   - Remove all Radix UI direct dependencies
   - Install shadcn/ui CLI
   - Initialize shadcn/ui in the project
   - Configure theme and styling

## Phase 2: Component Migration
1. UI Components (Priority Order)
   - Migrate base components in `/components/ui`
   - Update component imports to use shadcn/ui
   - Components to migrate:
     - Button
     - Input
     - Form elements
     - Dialog/Modal
     - Navigation components
     - Toast notifications
     - Tabs
     - Accordion
     - Avatar
     - Checkbox
     - Dropdown menu
     - Progress
     - Radio group
     - Scroll area
     - Select
     - Separator
     - Slider

2. Feature Components
   - Migrate components in order:
     - `/components/layout`
     - `/components/auth`
     - `/components/cart`
     - `/components/checkout`
     - `/components/products`
     - `/components/search`
     - `/components/wishlist`
     - `/components/affiliate`
     - `/components/ambassador`

## Phase 3: Route Migration (Next.js 15)
1. Update Route Structure
   - Review and update middleware.ts for Next.js 15 compatibility
   - Migrate to new Next.js 15 routing patterns
   - Update dynamic routes
   - Implement new metadata API changes

2. Update Data Fetching
   - Migrate to new Server Actions pattern
   - Update Supabase integration for Next.js 15
   - Implement new caching strategies

## Phase 4: Testing and Optimization
1. Functionality Testing
   - Test all user flows
   - Verify authentication flows
   - Test cart and checkout process
   - Verify search functionality
   - Test affiliate and ambassador features

2. Performance Testing
   - Run Lighthouse audits
   - Check Core Web Vitals
   - Verify SSR functionality
   - Test loading states

3. Style and Theme Verification
   - Verify dark/light mode
   - Check responsive design
   - Ensure consistent styling
   - Validate accessibility

## Phase 5: Deployment
1. Pre-deployment Tasks
   - Update environment variables
   - Verify build process
   - Update deployment configurations

2. Staging Deployment
   - Deploy to staging environment
   - Run full test suite
   - Monitor for errors

3. Production Migration
   - Create rollback plan
   - Schedule maintenance window
   - Deploy to production
   - Monitor metrics and errors

## Rollback Plan
1. Immediate Issues
   - Keep backup branch ready
   - Document reversion steps
   - Maintain old configuration

2. Long-term Issues
   - Keep old dependencies in package.json comments
   - Document major changes
   - Store configuration backups

## Notes
- Each phase should be committed separately
- Test after each major component migration
- Keep old components until fully migrated
- Document breaking changes
- Update documentation as we progress 