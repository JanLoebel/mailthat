import { BaseContext } from 'koa';
import Router from '@koa/router';

export const createStatusRouter = (): Router => {
  const router = new Router();
  router.get('/status', status);
  return router;
};

const status = async(ctx: BaseContext): Promise<void> => {
  ctx.status = 200;
  ctx.body = { status: 'Up and running!' };
}
