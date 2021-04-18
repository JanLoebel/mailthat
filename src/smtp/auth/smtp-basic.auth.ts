import { SMTPServerAuthentication } from 'smtp-server';

const smtpBasicAuthMiddleware = async (smtpAuth: SMTPServerAuthentication, expectedUsername: string, expectedPassword: string): Promise<boolean> => {
  return !!smtpAuth.username && !!smtpAuth.password && smtpAuth.username === expectedUsername && smtpAuth.password === expectedPassword;
}

export default smtpBasicAuthMiddleware;