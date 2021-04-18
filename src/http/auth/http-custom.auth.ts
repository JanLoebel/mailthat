import { Request } from 'koa';

const httpCustomAuthMiddleware = async (req: Request): Promise<boolean> => {
  // Feel free to implement what you want
  return false;
}

export default httpCustomAuthMiddleware;