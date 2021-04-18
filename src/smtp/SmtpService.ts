import { readFileSync } from 'fs';
import { Server } from 'net';
import { SMTPServer, SMTPServerAuthentication, SMTPServerAuthenticationResponse, SMTPServerDataStream, SMTPServerOptions, SMTPServerSession } from 'smtp-server';
import { ParsedMail, simpleParser } from 'mailparser';

import Logger from '../logger/logger';
import { SmtpServiceConfig } from '../config/smtp-config.model';
import { IMailSender } from '../transport/IMailSender';
import { buildMailWithDefaults } from '../utils/MailUtils';
import smtpBasicAuth from './auth/smtp-basic.auth';

type OnAuthCallback = (err: Error | null | undefined, response?: SMTPServerAuthenticationResponse) => void;
type OnDefaultCallback = (err?: Error | null) => void;

export class SmtpService {

  private app: SMTPServer | null = null;
  private server: Server | null = null;

  constructor(
    private config: SmtpServiceConfig,
    private mailSender: IMailSender,
  ) {}

  start(): void {
    if (!!this.server) {
      // Server is already running
      Logger.warn(`Smtp service is already started, stop it before starting it again.`);
      return;
    }

    const securityOptions = this.buildSecurityOptions(this.config);

    this.app = new SMTPServer({
      ...securityOptions,

      allowInsecureAuth: true,
      disableReverseLookup: true,
      maxClients: 10,

      size: 1 * 1024, // 1MB
      name: 'mailthat',

      onAuth: (auth, session, callback) => this.onAuth(auth, session, callback),
      onConnect: (session, callback) => this.onConnect(session, callback),
      onData: (stream, session, callback) => this.onData(stream, session, callback),
    });
    this.app.on('error', (err: Error) => this.onError(err));

    this.server = this.app.listen(this.config.port)
    Logger.info(`SmtpService is listening on port: ${this.config.port}...`);
  };

  private onError(err: Error): void {
    Logger.error(err);
  } 

  private buildSecurityOptions(config: SmtpServiceConfig): Partial<SMTPServerOptions> {
    if (config.secure === false) {
      // Security disabled
      return {
        secure: false,
        hideSTARTTLS: true,
      }
    } else {
      // Security enabled
      return {
        secure: true,
        key: readFileSync(config.secure.key),
        cert: readFileSync(config.secure.cert),
      };
    }
  }

  private async onAuth(auth: SMTPServerAuthentication, session: SMTPServerSession, callback: OnAuthCallback): Promise<void> {
    if (await this.isAuthenticated(this.config, auth, session)) {
      return callback(null, { user: 'mailthat' });
    } else {
      Logger.debug('Authentication check failed for config:', this.config.auth);
      return;
    }
  }

  private onConnect(session: SMTPServerSession, callback: OnDefaultCallback): void {
    const allowedIps = this.config.allowedIps || [];
    if (allowedIps.length === 0) {
      // Empty or not set means allow all
      return callback();
    }

    const isRemoteAddressAllowed = allowedIps.find(ip => ip === session.remoteAddress) !== undefined;
    if (isRemoteAddressAllowed) {
      return callback();
    }

    Logger.debug('Remote address not allowed:', session.remoteAddress);
    return callback(new Error('Connection not allowed!'));
  }

  private async onData(stream: SMTPServerDataStream, session: SMTPServerSession, callback: OnDefaultCallback): Promise<void> {
    try {
      const parsedMail: ParsedMail = await simpleParser(stream);
      const convertedMail: Record<string, any> = this.convertParsedMail(parsedMail);
      const mailResult = buildMailWithDefaults(convertedMail, this.config.defaults);
      if (!mailResult.success) {
        Logger.debug('Data are not valid!', mailResult.error, convertedMail);
        return callback(new Error('Given data is invalid!'));
      }
      try {
        await this.mailSender.sendMail(mailResult.data);
        Logger.debug('Mail sended...', mailResult.data);
        return callback();
      } catch(err) {
        Logger.error('Error while sending mail', mailResult.data, err);
        return callback(new Error('Error while sending mail!'));
      }
    } catch (err) {
      Logger.error('Unkown error while handling data handling', err);
      return callback(new Error('Unknown error!'));
    }
  }

  private convertParsedMail(parsedMail: ParsedMail): Record<string, any> {
    return {
      to: this.parseTo(parsedMail),
      from: this.parseFrom(parsedMail),
      subject: parsedMail.subject,
      text: parsedMail.text
    };
  }

  private parseTo(parsedMail: ParsedMail): string | Array<string> | undefined {
    if (Array.isArray(parsedMail.to)) {
      const result: Array<string> = [];
      parsedMail.to.forEach(m => m.value.forEach(v => result.push(v.address || '')));
      return result;
    }
    return parsedMail.to?.value.map(v => v.address || '');
  }

  private parseFrom(parsedMail: ParsedMail): string | undefined {
    // Use first value
    return parsedMail.from?.value[0].address;
  }

  private async isAuthenticated(config: SmtpServiceConfig, smtpAuth: SMTPServerAuthentication, session: SMTPServerSession): Promise<boolean> {
    const auth = config.auth;
    if (auth === undefined || auth === null) {
      return true;
    }

    switch (auth.type) {
      case 'basic': return await smtpBasicAuth(smtpAuth, auth.username, auth.password);
      default: return false;
    }
  }

  stop(): void {
    this.server?.close();
    this.server = null;
    this.app = null;
  }
}