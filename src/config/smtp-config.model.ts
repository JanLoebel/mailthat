import * as z from 'zod';

import { ServiceDefaultsSchema } from './base-config.model';

const SmtpSecureEnabledSchema = z.object({
  key: z.string(),
  cert: z.string()
});
const SmtpSecureDisabledSchema = z.literal(false)
const SmtpSecureSchema = z.union([SmtpSecureDisabledSchema, SmtpSecureEnabledSchema]);

const SmtpBasicAuthSchema = z.object({
  type: z.literal('basic'),
  username: z.string(),
  password: z.string(),
});

const AnySmtpAuthSchema = SmtpBasicAuthSchema;

const SmtpServiceConfigSchema = z.object({
  port: z.number(),
  secure: SmtpSecureSchema,
  defaults: ServiceDefaultsSchema.optional(),
  allowedIps: z.array(z.string()).optional(),
  auth: AnySmtpAuthSchema.optional(),
});

export const SmtpServiceConfigSchemaArray = z.array(SmtpServiceConfigSchema).refine(
  (value) => {
    const ports = value.map((httpServiceConfig) => httpServiceConfig.port);
    const containsDuplicatePort = ports.some((val, i) => ports.indexOf(val) !== i);
    return !containsDuplicatePort;
  },
  {
    message: 'SmtpService port can only be declared once.',
    path: ['port'],
  },
);


export type SmtpServiceConfig = z.infer<typeof SmtpServiceConfigSchema>