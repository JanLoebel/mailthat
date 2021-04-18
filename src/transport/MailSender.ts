import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

import { IMailSender } from './IMailSender';
import { OutgoingSmtpConfig } from '../config/config.model';
import { Mail } from '../models/Mail';
import Logger from '../logger/logger';

export class MailSender implements IMailSender {
  private readonly transporter: Transporter;

  constructor(smtpConfig: OutgoingSmtpConfig) {
    this.transporter = createTransport(smtpConfig);
  }

  async sendMail(mail: Mail) {
    const mailOptions: SendMailOptions = {
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    };

    Logger.info('Sending mail...', mailOptions);
    await this.transporter.sendMail(mailOptions);
  }
}
