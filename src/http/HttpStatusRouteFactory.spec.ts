import { Server } from 'http';
import Koa from 'koa';
import supertest from 'supertest';

import { createStatusRouter } from './HttpStatusRouteFactory';

describe('HttpStatusRouteFactory', () => {
  let server: Server;

  beforeAll(() => {
    const app = new Koa();
    const statusRouter = createStatusRouter();
    app.use(statusRouter.routes()).use(statusRouter.allowedMethods());
    server = app.listen(0);
  });

  it('provide working status endpoint', async () => {
    const response = await supertest(server).get('/status');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ status: 'Up and running!' });
  });
});
