import * as z from 'zod';

export const ServiceDefaultsSchema = z.object({
  to: z.string().email().optional(),
  from: z.string().email().optional(),
  subject: z.string().optional(),
  text: z.string().optional(),
});

export type ServiceDefaults = z.infer<typeof ServiceDefaultsSchema>;