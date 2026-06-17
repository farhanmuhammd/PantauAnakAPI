import { z } from 'zod';

export const createTeacherProfileSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    birthDate: z.coerce.date().optional(),
    birthPlace: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    employeeId: z.string().optional(),
    classId: z.string().optional(),
}).strict();

export const updateTeacherProfileSchema = createTeacherProfileSchema.partial();