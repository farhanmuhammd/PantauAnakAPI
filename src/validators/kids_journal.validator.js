import { z } from 'zod';

export const createKidsJournalSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    caption: z.string().optional(),
    childs: z
        .string()
        .transform((val, ctx) => {
            try {
                const parsed = JSON.parse(val);
                if (!Array.isArray(parsed) || parsed.length === 0) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Childs must be a non-empty array' });
                    return z.NEVER;
                }
                return parsed;
            } catch {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Childs must be a valid JSON array' });
                return z.NEVER;
            }
        }).optional()
});