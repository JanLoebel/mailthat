import { ZodError } from 'zod';

import { ServiceDefaults } from '../config/base-config.model';
import { Mail, MailSchema } from '../models/Mail';

type SafeMailResult = {
  success: true;
  data: Mail;
} | {
  success: false;
  error: ZodError;
};

export const buildMailWithDefaults = (data: Record<string, any>, defaults: ServiceDefaults | undefined): SafeMailResult => {
  // Build result object
  return MailSchema.safeParse({
    to: data.to,
    from: data.from,
    subject: data.subject,
    text: data.text,

    // Overwrite values by defaults
    ...(!!defaults ? defaults : {}),
  });
};
