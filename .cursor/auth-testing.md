# Authentication Testing Script

## Prerequisites
- Supabase project set up
- Test user accounts:
  - Regular user: `test@example.com` / `password123`
  - Admin user: `admin@example.com` / `adminpass123`
- Clear browser cache/cookies before each test sequence

## Test Sequences

### 1. Registration Flow
1. Navigate to `/account/register`
2. Enter new user details:
   - Email: `newuser@example.com`
   - Password: `newuserpass123`
   - (Other required fields)
3. Submit the form
4. Verify redirect to confirmation page
5. Check email for verification link
6. Click verification link
7. Verify successful account creation
8. Attempt to log in with new credentials

**Expected Results:**
- User should be registered in Supabase
- Verification email should be sent
- User should be able to verify email
- User should be able to log in after verification

### 2. Login Flow
1. Navigate to `/account/login`
2. Enter test user credentials
3. Submit the form
4. Verify redirect to account page
5. Check that user data is displayed correctly
6. Test session persistence by refreshing the page
7. Navigate to other protected pages

**Expected Results:**
- User should be authenticated
- Session should persist across page navigation
- Protected user data should be accessible

### 3. Password Reset Flow
1. Navigate to `/account/forgot-password`
2. Enter test user email
3. Submit the form
4. Check email for reset link
5. Click reset link
6. Enter new password
7. Submit the form
8. Attempt to log in with new password

**Expected Results:**
- Reset email should be sent
- User should be able to set a new password
- User should be able to log in with new password

### 4. Protected Routes
1. Log out any existing user
2. Try to access these protected routes directly:
   - `/account`
   - `/account/orders`
   - `/checkout`
   - `/admin` (if applicable)
3. Verify redirection to login page
4. Log in as regular user
5. Try to access admin routes
6. Log in as admin user
7. Verify access to admin routes

**Expected Results:**
- Unauthenticated users should be redirected to login
- Regular users should not access admin routes
- Admin users should access all routes

### 5. Logout Flow
1. Log in as test user
2. Click logout button/link
3. Verify redirect to home page
4. Try to access protected routes
5. Check local storage and cookies for cleared state

**Expected Results:**
- User session should end
- Auth cookies should be cleared
- Protected routes should be inaccessible

### 6. Social Authentication (if implemented)
1. Navigate to login page
2. Click social login options (Google, GitHub, etc.)
3. Complete authentication flow with social provider
4. Verify redirect back to app
5. Check that user is authenticated

**Expected Results:**
- Social auth flow should complete successfully
- User should be authenticated in the application
- User profile should contain data from social provider

## Common Issues to Check

1. Cookie Handling
   - Verify proper async/await pattern with cookies() API
   - Check for secure and httpOnly flags
   - Verify SameSite attribute is properly set

2. Token Management
   - Check for proper refresh token handling
   - Verify token expiration handling

3. Error Handling
   - Test with invalid credentials
   - Test with network errors
   - Check error messages and UX

## Debugging Tips

1. Use browser dev tools to inspect:
   - Network requests to auth endpoints
   - Cookies being set
   - Local storage values

2. Check server logs for:
   - Authentication errors
   - Token validation issues
   - Database connection problems

3. Supabase Auth Debugging:
   - Check Supabase dashboard for auth events
   - Verify email provider settings
   - Check auth webhook functionality 