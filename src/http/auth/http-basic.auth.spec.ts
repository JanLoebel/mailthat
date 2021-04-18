import { Request } from 'koa';

import basicAuthMiddleware from './http-basic.auth';

describe('Http Basic Authentication', () => {

  it('works with valid credentials', async () => {
    const authorization = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=';
    const req = { headers: { authorization: authorization} } as Request;
    const result = await basicAuthMiddleware(req, 'username', 'password');
    expect(result).toBe(true);
  });

  it('fails with invalid credentials', async () => {
    const authorization = 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=';
    const req = { headers: { authorization: authorization} } as Request;
    const result = await basicAuthMiddleware(req, 'username', 'anotherPassword');
    expect(result).toBe(false);
  });

  it('fails with missing basic type', async () => {
    const authorization = 'dXNlcm5hbWU6cGFzc3dvcmQ=';
    const req = { headers: { authorization: authorization} } as Request;
    const result = await basicAuthMiddleware(req, 'username', 'password');
    expect(result).toBe(false);
  });

});
