import { z } from 'zod'

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(100, 'Email must be less than 100 characters')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  )

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be less than 50 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers and underscores'
  )

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .or(z.literal(''))
  .optional()

export const phoneSchema = z
  .string()
  .regex(
    /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    'Please enter a valid phone number'
  )
  .or(z.literal(''))
  .optional()

// Auth schemas
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Profile schemas
export const profileSchema = z.object({
  name: nameSchema,
  username: usernameSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: urlSchema,
  phone: phoneSchema,
})

// Reviews schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
  productId: z.string().uuid('Invalid product ID'),
})

// Email subscription schema
export const emailSubscriptionSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  preferences: z.object({
    productUpdates: z.boolean().optional(),
    saleAlerts: z.boolean().optional(),
    newsletter: z.boolean().optional(),
  }).optional(),
})

// Helper function to validate data against a schema
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  error?: { message: string; field?: string } 
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { 
        success: false, 
        error: { 
          message: firstError.message, 
          field: firstError.path.join('.') 
        } 
      }
    }
    return { 
      success: false, 
      error: { 
        message: 'Validation failed' 
      } 
    }
  }
} 