# shadcn/ui Guidelines

## Component Usage

### Always Use shadcn/ui Components
- **DO NOT** use Radix UI components directly
- **DO** use shadcn/ui components from `@/components/ui/`
- **DO** follow the shadcn/ui component patterns and styling

### Adding New Components
When adding a new UI component:
1. Use the shadcn/ui CLI to add it: `npx shadcn-ui@latest add [component-name]`
2. Customize the component as needed while maintaining the shadcn/ui patterns
3. Document any customizations made

### Component Customization
- Maintain the shadcn/ui class naming conventions
- Use the `cn()` utility for class name merging
- Keep the component API consistent with other shadcn/ui components

## Code Commit Guidelines

### Commit After Every Working Update
- Make small, focused commits
- Ensure the application builds successfully before committing
- Test the component or feature before committing
- Use descriptive commit messages

### Commit Message Format
```
feat(component): add switch component
fix(auth): resolve login redirect issue
refactor(cart): improve cart summary component
```

### Testing Before Commit
- Verify the component renders correctly
- Check for console errors
- Test the component's functionality
- Ensure responsive behavior works as expected

## Migration Checklist

When migrating components from direct Radix UI to shadcn/ui:
- [ ] Remove direct Radix UI imports
- [ ] Add the shadcn/ui component using the CLI
- [ ] Update all component references
- [ ] Test the component thoroughly
- [ ] Commit the working changes

## Common Issues

### Styling Conflicts
- Use the shadcn/ui theme variables
- Avoid direct styling that might override shadcn/ui styles
- Use the `className` prop for additional styling

### Component Props
- Maintain the same props API as the original shadcn/ui component
- Document any additional props added
- Use TypeScript for prop type safety 