import { Server } from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import supertest from 'supertest';

import { IMailSender } from '../transport/IMailSender';
import { HttpServiceConfig } from '../config/http-config.model';
import { createMailRouter } from './HttpMailRouteFactory';
import { AppContext, AppState } from './KoaAppModels';

describe('HttpMailRouteFactory', () => {
  let server: Server;

  const setupServer = (config: HttpServiceConfig, mailSender: IMailSender) => {
    const app = new Koa<AppState, AppContext>();
    app.use(bodyParser());

    app.context.config = config;
    app.context.mailSender = mailSender;

    const mailRouter = createMailRouter();
    app.use(mailRouter.routes()).use(mailRouter.allowedMethods());
    server = app.listen(0);
    return server;
  };

  const createMailSenderMock = () => {
    const MockMailSender = jest.fn<IMailSender, []>(() => ({
      sendMail: jest.fn(),
    }));
    return new MockMailSender();
  }

  it('send mail when no default config is given', async () => {
    const config: HttpServiceConfig = {
      port: 0,
    };

    const mailSenderMock = createMailSenderMock();
    const server = setupServer(config, mailSenderMock);

    const body = {
      to: 'to@to.com',
      from: 'from@from.com',
      subject: 'subject',
      text: 'text'
    };
    const response = await supertest(server).post('/mail').send(body);
    expect(response.status).toEqual(204);
    expect(mailSenderMock.sendMail).toHaveBeenCalledWith({
      ...body
    });
    server.close();
  });

  it('send mail when default overwrite is given', async () => {
    const config: HttpServiceConfig = {
      port: 0,
      defaults: {
        from: 'from@overwrite.com',
        to: 'to@overwrite.com',
        subject: 'subject-overwrite',
        text: 'text-overwrite'
      }
    };

    const mailSenderMock = createMailSenderMock();
    const server = setupServer(config, mailSenderMock);

    const body = {
      to: 'to@to.com',
      from: 'from@from.com',
      subject: 'subject',
      text: 'text'
    };
    const response = await supertest(server).post('/mail').send(body);
    expect(response.status).toEqual(204);
    expect(mailSenderMock.sendMail).toHaveBeenCalledWith({
      ...config.defaults
    });
    server.close();
  });

  it('send mail when to is missing', async () => {
    const config: HttpServiceConfig = {
      port: 0,
    };

    const mailSenderMock = createMailSenderMock();
    const server = setupServer(config, mailSenderMock);

    const body = {
      from: 'from@from.com',
      subject: 'subject',
      text: 'text'
    };
    const response = await supertest(server).post('/mail').send(body);
    expect(response.status).toEqual(400);
    server.close();
  });
});
