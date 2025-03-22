# Authentication Testing Guide

## Implementation Status ✅
All authentication tests have been successfully implemented and are passing. The test suite uses a mock Supabase client instead of MSW for more reliable and maintainable tests.

## Test Implementation
Located in `tests/auth/auth-flow.test.ts`:

### Completed Test Cases ✅
1. User Registration
2. User Login
3. Password Reset
4. Session Management
5. Error Handling

### Mock Implementation
We use a custom mock Supabase client that:
- Simulates authentication flows
- Returns properly typed responses
- Supports method chaining
- Handles error cases
- Maintains test isolation

```typescript
// Example mock client implementation
const mockSupabaseClient = {
  auth: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
  },
  // ... other methods
};
```

## Running Tests
```bash
# Run all auth tests
npm test auth-flow.test.ts

# Run specific test
npm test auth-flow.test.ts -t "should handle user registration"
```

## Test Prerequisites
- No external dependencies required
- Tests run in isolation using mock client
- No need for actual Supabase connection

## Common Testing Patterns

### AAA Pattern Used
```typescript
// Arrange
const mockClient = createMockSupabaseClient();
const email = "test@example.com";
const password = "password123";

// Act
const result = await mockClient.auth.signUp({ email, password });

// Assert
expect(result.data.user).toBeDefined();
expect(result.error).toBeNull();
```

### Error Testing
```typescript
// Testing error scenarios
test("handles invalid credentials", async () => {
  const mockClient = createMockSupabaseClient({
    shouldFail: true,
    errorMessage: "Invalid credentials"
  });
  
  const result = await mockClient.auth.signIn({
    email: "invalid@example.com",
    password: "wrongpass"
  });
  
  expect(result.error).toBeDefined();
  expect(result.error.message).toBe("Invalid credentials");
});
```

## Best Practices Implemented
1. Use TypeScript for type safety
2. Mock external dependencies
3. Test both success and error cases
4. Clean up after each test
5. Use proper assertions
6. Maintain test isolation

## Debugging Tips
- Check mock client configuration
- Verify test data matches expected formats
- Use proper TypeScript types
- Run tests in isolation when debugging

## Next Steps
1. ✅ All authentication tests are complete
2. 🔄 Implement remaining user profile tests
3. 🔄 Add tests for protected routes
4. 🔄 Test Supabase storage integration for avatars

## Related Documentation
- [Project Structure](./rules/project-structure.mdc)
- [Development Standards](./rules/development-standards.mdc)
- [Test Checklist](./test-checklist.md) 