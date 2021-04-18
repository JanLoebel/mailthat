import * as z from 'zod';
import { ServiceDefaultsSchema } from './base-config.model';

const HttpBasicAuthSchema = z.object({
  type: z.literal('basic'),
  username: z.string(),
  password: z.string(),
});

const HttpCustomAuthSchema = z.object({
  type: z.literal('custom'),
});

const AnyHttpAuthSchema = z.union([HttpBasicAuthSchema, HttpCustomAuthSchema]);

const HttpServiceConfigSchema = z.object({
  port: z.number().nonnegative(),
  defaults: ServiceDefaultsSchema.optional(),
  auth: AnyHttpAuthSchema.optional(),
});

export const HttpServiceConfigSchemaArray = z.array(HttpServiceConfigSchema).refine(
  (value) => {
    const ports = value.map((httpServiceConfig) => httpServiceConfig.port);
    const containsDuplicatePort = ports.some((val, i) => ports.indexOf(val) !== i);
    return !containsDuplicatePort;
  },
  {
    message: 'HttpService port can only be declared once.',
    path: ['port'],
  },
);

export type HttpServiceConfig = z.infer<typeof HttpServiceConfigSchema>;