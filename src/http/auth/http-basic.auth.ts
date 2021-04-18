import { Request } from 'koa';

const httpBasicAuthMiddleware = async (req: Request, expectedUsername: string, expectedPassword: string): Promise<boolean> => {
  if(!(req.headers.authorization || '').toLowerCase().startsWith('basic')) {
    return false;
  }

  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
  return !!login && !!password && login === expectedUsername && password === expectedPassword;
}

export default httpBasicAuthMiddleware;