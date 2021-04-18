import * as z from 'zod';

export const MailSchema = z.object({
  from: z.string().email(),
  to: z.union([
    z.string().email(),
    z.array(z.string().email())
  ]),
  subject: z.string(),
  text: z.string(),
});

export type Mail = z.infer<typeof MailSchema>;
