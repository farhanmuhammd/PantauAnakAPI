import { z } from 'zod';

const childSchema = z.object({
    fullName: z.string().min(1, 'Child full name is required'),
    birthDate: z.coerce.date().optional(),
    birthPlace: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
});

const parentSchema = z.object({
    fullName: z.string().min(1, 'Parent full name is required'),
    birthDate: z.coerce.date().optional(),
    birthPlace: z.string().optional(),
    phone: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
    address: z.string().min(1, 'Address is required'),
});

export const createProfileSchema = z.object({
    children: z.array(childSchema).min(1, 'At least one child is required'),
    parents: z.array(parentSchema).optional(),
}).strict();

export const updateProfileSchema = z.object({
    children: z.array(childSchema).optional(),
    parents: z.array(parentSchema).optional(),
}).strict();