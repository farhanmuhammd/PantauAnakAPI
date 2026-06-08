import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['parent', 'teacher', 'admin']).optional(),
}).strict();

export const loginSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(1, 'Password is required'),
}).strict();

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
}).strict();
