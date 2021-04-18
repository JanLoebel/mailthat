import * as z from 'zod';

import { HttpServiceConfigSchemaArray } from './http-config.model';
import { SmtpServiceConfigSchemaArray } from './smtp-config.model';

export const OutgoingSmtpConfigSchema = z.object({
  host: z.string(),
  port: z.number().nonnegative(),
  ignoreTLS: z.boolean().optional().default(true),
  secure: z.boolean().optional().default(false),
});

export const ConfigSchema = z.object({
  outgoingSmtp: OutgoingSmtpConfigSchema,
  httpServices: HttpServiceConfigSchemaArray.optional(),
  smtpServices: SmtpServiceConfigSchemaArray.optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
export type OutgoingSmtpConfig = z.infer<typeof OutgoingSmtpConfigSchema>;
