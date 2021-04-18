import { ParameterizedContext, Request } from 'koa';
import Router from '@koa/router';

import Logger from '../logger/logger';
import { AppState, AppContext } from './KoaAppModels';
import { buildMailWithDefaults } from '../utils/MailUtils';
import { HttpServiceConfig } from '../config/http-config.model';
import httpBasicAuthMiddleware from './auth/http-basic.auth';
import httpCustomAuthMiddleware from './auth/http-custom.auth';

export const createMailRouter = (): Router => {
  const router = new Router<AppState, AppContext>();
  router.use(buildAuthMiddleware);
  router.post('/mail', sendMail);
  return router;
};

const sendMail = async (ctx: ParameterizedContext<AppState, AppContext>): Promise<void> => {
  const mailResult = buildMailWithDefaults(ctx.request.body, ctx.config.defaults);
    if (mailResult.success) {
      try {
        await ctx.mailSender.sendMail(mailResult.data);
      } catch (error) {
        Logger.error('Error while sending mail', null, error);
        ctx.status = 500;
        ctx.body = { error: 'Error sending mail' };
        return;
      }

      ctx.status = 204;
      ctx.body = {};
      return; 
    } else {
      Logger.debug('Bad request', mailResult.error);
      ctx.status = 400;
      ctx.body = { error: mailResult.error };
      return;
    }
}

const buildAuthMiddleware = async (ctx: ParameterizedContext<AppState, AppContext>, next: any) => {
  if (await isAuthenticated(ctx.config, ctx.request)) {
    await next();
  } else {
    Logger.debug('Authentication check failed for config:', ctx.config.auth);
    ctx.status = 401;
    return;
  }
}

const isAuthenticated = async (config: HttpServiceConfig, req: Request): Promise<boolean> => {
  const auth = config.auth;
  if (auth === undefined || auth === null) {
    return true;
  }

  switch (auth.type) {
    case 'basic': return await httpBasicAuthMiddleware(req, auth.username, auth.password);
    case 'custom': return await httpCustomAuthMiddleware(req);
    default: return false;
  }
}