import Koa from 'koa';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import { Server } from 'http';

import { HttpServiceConfig } from '../config/http-config.model';
import Logger from '../logger/logger';
import { createStatusRouter } from './HttpStatusRouteFactory';
import { createMailRouter } from './HttpMailRouteFactory';
import { AppContext, AppState } from './KoaAppModels';
import { IMailSender } from '../transport/IMailSender';

export class HttpService {
  private app: Koa<AppState, AppContext> | null = null;
  private server: Server | null = null;

  constructor(private config: HttpServiceConfig, private mailSender: IMailSender) {}

  start(): Server | undefined  {
    if (!!this.server) {
      // Server is already running
      Logger.warn(`Http service is already started, stop it before starting it again.`);
      return;
    }

    // Configure server
    this.app = new Koa<AppState, AppContext>();
    this.app.use(helmet());
    this.app.use(bodyParser());

    // Set context
    this.app.context.config = this.config;
    this.app.context.mailSender = this.mailSender;
    
    const statusRouter = createStatusRouter();
    this.app.use(statusRouter.routes()).use(statusRouter.allowedMethods());

    const mailRouter = createMailRouter();
    this.app.use(mailRouter.routes()).use(mailRouter.allowedMethods());

    // Start server
    const port = this.config.port;
    Logger.debug(`Starting http service...`);
    this.server = this.app.listen(port);
    Logger.info(`HttpService is listening on port: ${port}...`);
    return this.server;
  }

  stop(): void {
    this.server?.close();
    this.server = null;
    this.app = null;
  }
}
