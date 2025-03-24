# Phase 4 One-Shot Implementation Guide

This guide explains how to implement all Phase 4 features in a single operation using the optimized tools and templates.

## Prerequisites

Before beginning the one-shot implementation, ensure:

1. All Phase 3 features are complete
2. The `.prompt` file is updated with the Phase 4 templates
3. You have NodeJS installed to run the generator script

## Step 1: Run the Phase 4 Generator

```bash
# Make the script executable
chmod +x scripts/phase4-generator.js

# Run the generator
node scripts/phase4-generator.js
```

## Step 2: Feature Selection

The generator will prompt you to select which Phase 4 features to implement:

- Reviews System
- Wishlist Functionality
- Email Marketing Integration
- Product Recommendations
- Advanced Search

Select "Y" for features you want to implement, or "n" to skip.

## Step 3: Additional Configuration

You'll be prompted for additional configuration:

- Email service provider (e.g., SendGrid, Mailchimp)
- Recommendation algorithm preference
- Search implementation approach

## Step 4: Review Generated Files

The generator creates a directory structure in `phase4-output/` containing:

- Database migrations
- TypeScript type definitions
- Component templates
- Server actions
- Repository implementations

## Step 5: Apply Generated Files

Review the generated files and apply them to your project. You can use the built-in AI assistance to:

1. Apply database migrations
2. Implement components and repositories
3. Test functionality
4. Update documentation

## Memory Management

The one-shot approach optimizes memory management by:

1. Focusing only on selected features
2. Using templates from the `.prompt` file
3. Generating structured output files
4. Tracking progress in a log file
5. Providing a clear implementation path

## Verification Checklist

After implementation, verify each feature:

- [ ] Database schema updated
- [ ] API endpoints implemented
- [ ] Frontend components working
- [ ] Server actions functional
- [ ] Types properly defined
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Performance optimized

## Troubleshooting

If issues arise during implementation:

1. Check the `phase4-progress.log` file
2. Verify template structures in the `.prompt` file
3. Ensure database migrations are applied correctly
4. Check for TypeScript errors
5. Verify server component/client component boundaries

## Next Steps

After successful implementation:

1. Update project status documentation
2. Plan Phase 5 implementation
3. Consider performance optimizations
4. Review security considerations 