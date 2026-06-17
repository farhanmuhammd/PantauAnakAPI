import { z } from 'zod';

export const pickupTimeSchema = z.object({
    pickupTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'pickupTime must be in HH:mm format'),
}).strict();