import { DefaultContext, DefaultState } from 'koa';

import { IMailSender } from '../transport/IMailSender';
import { HttpServiceConfig } from '../config/http-config.model';

export interface AppState extends DefaultState {}

export interface AppContext extends DefaultContext {
  config: HttpServiceConfig;
  mailSender: IMailSender;
}