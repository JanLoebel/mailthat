import { ZodError } from 'zod';
import { Config, ConfigSchema } from './config.model';

describe('Smtp Config schema validation', () => {
  it('simple smtp only config', () => {
    const config: Config = {
      outgoingSmtp: { host: 'localhost', port: 1234 },
      smtpServices: [{
        port: 465,
        secure: false
      }]
    };
    const result = ConfigSchema.parse(config);
    expect(result).toMatchObject<Config>(config);
  });

  it('duplicated smtp service port will fail', () => {
    const t = () => {
      const config: Config = {
        outgoingSmtp: { host: 'localhost', port: 1234 },
        smtpServices: [
          { port: 465, secure: false },
          { port: 465, secure: false }
        ],
      };
      ConfigSchema.parse(config);
    };
    expect(t).toThrow(ZodError);
  });

  it('simple smtp basic auth', () => {
    const config: Config = {
      outgoingSmtp: { host: 'localhost', port: 1234 },
      smtpServices: [{
        port: 465,
        secure: false,
        auth: {
          type: 'basic',
          username: 'username',
          password: 'password'
        }
      }],
    };
    ConfigSchema.parse(config);
  });

  it('basic auth without all required fields should fail', () => {
    const t = () => {
      const config = {
        outgoingSmtp: { host: 'localhost', port: 1234 },
        smtpServices: [{
          port: 465,
          secure: false,
          auth: {
            type: 'basic',
            username: 'username'
          }
        }],
      };
      ConfigSchema.parse(config);
    };
    expect(t).toThrow(ZodError);
  });

  it('missing secure setting', () => {
    const t = () => {
      const config = {
        outgoingSmtp: { host: 'localhost', port: 1234 },
        smtpServices: [{
          port: 465,
        }],
      };
      ConfigSchema.parse(config);
    };
    expect(t).toThrow(ZodError);
  });

  it('if secure is set we need key + cert setting', () => {
    const config: Config = {
      outgoingSmtp: { host: 'localhost', port: 1234 },
      smtpServices: [{
        port: 465,
        secure: {
          cert: '',
          key: ''
        }
      }],
    };
    ConfigSchema.parse(config);
  });
});
