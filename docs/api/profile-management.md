# Profile Management API Documentation

## Profile Update

```typescript
/**
 * @api {put} /api/profile Update User Profile
 * @apiName UpdateUserProfile
 * @apiGroup Profile
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} userId User's unique ID
 * @apiParam {String} name User's full name
 * @apiParam {String} email User's email address
 *
 * @apiSuccess {Boolean} success Operation success status
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 */
```

## Avatar Upload

```typescript
/**
 * @api {post} /api/profile/avatar Upload Profile Avatar
 * @apiName UploadProfileAvatar
 * @apiGroup Profile
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {File} avatar Avatar image file
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {String} avatarUrl Public URL of uploaded avatar
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 */
```

## Address Management

### Add Address

```typescript
/**
 * @api {post} /api/profile/address Add User Address
 * @apiName AddUserAddress
 * @apiGroup Address
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} userId User's unique ID
 * @apiParam {String} street Street address
 * @apiParam {String} city City name
 * @apiParam {String} state State code
 * @apiParam {String} zipCode ZIP code (5 digits)
 *
 * @apiSuccess {Object} data Created address object
 * @apiSuccess {String} data.id Address ID
 * @apiSuccess {Boolean} data.isDefault Default status
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 */
```

### Set Default Address

```typescript
/**
 * @api {put} /api/profile/address Set Default Address
 * @apiName SetDefaultAddress
 * @apiGroup Address
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} addressId Address unique ID
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {Boolean} success Operation success status
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 */
```

### Get User Addresses

```typescript
/**
 * @api {get} /api/profile/address Get User Addresses
 * @apiName GetUserAddresses
 * @apiGroup Address
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {Array} data List of user addresses
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 */
```

## Preferences Management

### Get Preferences

```typescript
/**
 * @api {get} /api/profile/preferences Get User Preferences
 * @apiName GetUserPreferences
 * @apiGroup Preferences
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} userId User's unique ID
 *
 * @apiSuccess {Object} data User preferences object
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 */
```

### Update Preferences

```typescript
/**
 * @api {put} /api/profile/preferences Update User Preferences
 * @apiName UpdateUserPreferences
 * @apiGroup Preferences
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiParam {String} userId User's unique ID
 * @apiParam {Object} preferences Preference settings
 *
 * @apiSuccess {Object} data Updated preferences object
 *
 * @apiError {Object} error Error object
 * @apiError {String} error.message Error message
 */
```

## Rate Limiting

All endpoints are subject to the following rate limits:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Error Responses

All endpoints use the following error response format:

```json
{
  "error": {
    "message": "Human readable error message",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Invalid or missing authentication
- `INVALID_INPUT`: Invalid request parameters
- `NOT_FOUND`: Requested resource not found
- `FORBIDDEN`: User lacks permission
- `INTERNAL_ERROR`: Server error 