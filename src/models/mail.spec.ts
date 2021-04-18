import { ZodError } from 'zod';
import { Mail, MailSchema } from './Mail';

describe('Mail schema validation', () => {
  it('simple mail config', () => {
    const mail: Mail = {
      from: 'from@from.com',
      to: 'to@to.com',
      subject: 'subject',
      text: 'text',
    };
    const result = MailSchema.parse(mail);
    expect(result).toMatchObject<Mail>(mail);
  });

  it('simple mail config with multiple to', () => {
    const mail: Mail = {
      from: 'from@from.com',
      to: ['to@to.com', 'to2@to2.com'],
      subject: 'subject',
      text: 'text',
    };
    const result = MailSchema.parse(mail);
    expect(result).toMatchObject<Mail>(mail);
  });

  it('removes additional attributes', () => {
    const mail = {
      from: 'from@from.com',
      to: 'to@to.com',
      subject: 'subject',
      text: 'text',

      additionalAttribute: 'shouldBeRemoved',
    };

    const result = MailSchema.parse(mail);
    expect(result).toMatchObject<Mail>({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    });
  });

  it('invalid from email addresses produce errors', () => {
    const t = () => {
      const mail = {
        from: 'imnotavalidemail',
        to: 'to@to.com',
        subject: 'subject',
        text: 'text',
      };
      MailSchema.parse(mail);
    };
    expect(t).toThrow(ZodError);
  });

  it('invalid to email addresses produce errors', () => {
    const t = () => {
      const mail = {
        from: 'from@from.com',
        to: 'imnotavalidemail',
        subject: 'subject',
        text: 'text',
      };
      MailSchema.parse(mail);
    };
    expect(t).toThrow(ZodError);
  });

  it('missing fields produce errors', () => {
    const missingFrom = () => {
      const mail = {
        to: 'imnotavalidemail',
        subject: 'subject',
        text: 'text',
      };
      MailSchema.parse(mail);
    };
    expect(missingFrom).toThrow(ZodError);

    const missingTo = () => {
      const mail = {
        from: 'from@from.com',
        subject: 'subject',
        text: 'text',
      };
      MailSchema.parse(mail);
    };
    expect(missingTo).toThrow(ZodError);

    const missingSubject = () => {
      const mail = {
        to: 'imnotavalidemail',
        from: 'from@from.com',
        text: 'text',
      };
      MailSchema.parse(mail);
    };
    expect(missingSubject).toThrow(ZodError);

    const missingText = () => {
      const mail = {
        from: 'from@from.com',
        to: 'to@to.com',
        subject: 'subject',
      };
      MailSchema.parse(mail);
    };
    expect(missingText).toThrow(ZodError);
  });
});
