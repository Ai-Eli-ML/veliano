# Commit Rules

## When to Commit

### Commit After Every Working Update
- **ALWAYS** commit after completing a functional component or feature
- **ALWAYS** commit after fixing a bug
- **ALWAYS** commit after refactoring code that works
- **NEVER** leave working code uncommitted at the end of a session

### Pre-Commit Checklist
Before committing, ensure:
- [ ] Code builds without errors
- [ ] Component renders correctly
- [ ] Basic functionality works as expected
- [ ] No console errors in the browser
- [ ] Tests pass (if applicable)

## Commit Message Guidelines

### Format
```
type(scope): short description

[optional body]

[optional footer]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (formatting)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

### Scope
- Component name (e.g., `button`, `dialog`)
- Feature area (e.g., `auth`, `cart`, `checkout`)
- Page name (e.g., `product-page`, `dashboard`)

### Examples
```
feat(switch): add shadcn/ui switch component
fix(auth): resolve login redirect issue
refactor(cart): improve cart summary component
style(global): update dark mode colors
docs(readme): update installation instructions
```

## Branching Strategy

### Feature Branches
- Create a new branch for each feature or bug fix
- Branch from `main` or `development`
- Use descriptive branch names: `feat/add-switch-component`, `fix/login-redirect`

### Pull Requests
- Create a pull request for each feature branch
- Ensure all checks pass before merging
- Request code review when appropriate

## Commit Frequency

- Small, focused commits are better than large, monolithic ones
- Aim for 1-3 files per commit when possible
- Separate logical changes into different commits
- If a change affects multiple areas, consider multiple commits

## Emergency Procedure

If you need to stop work without completing a feature:
1. Commit the work-in-progress with a `WIP:` prefix
2. Add detailed notes about what's completed and what remains
3. Create a list of remaining tasks in the commit message 