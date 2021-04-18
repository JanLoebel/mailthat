import path from 'path';

import { ConfigService } from './config/ConfigService';
import { HttpService } from './http/HttpService';
import Logger from './logger/logger';
import { MailSender } from './transport/MailSender';
import { SmtpService } from './smtp/SmtpService';

Logger.debug('Starting mailthat...');

// Load config
const configPath = process.env.CONFIG_PATH || path.join(__dirname, '..', 'config', 'config.json');
const configService = new ConfigService(configPath);
const config = configService.getConfig();

// Create mailsender
Logger.debug('Setup MailSender...');
const mailSender = new MailSender(config.outgoingSmtp);

// Create http services
if (!!config.httpServices) {
  Logger.debug('Setup all HttpServices...');
  const httpServices = config.httpServices.map((config) => new HttpService(config, mailSender));
  httpServices.forEach((httpService) => httpService.start());
}

// Create smtp services
if (!!config.smtpServices) {
  Logger.debug('Setup all SmtpServices...');
  const smtpServices = config.smtpServices.map((config) => new SmtpService(config, mailSender));
  smtpServices.forEach((smtpService) => smtpService.start());
}

Logger.info('MailThat is up and running...');