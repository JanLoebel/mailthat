import { ZodError } from 'zod';
import { Config, ConfigSchema } from './config.model';

describe('Http Config schema validation', () => {
  it('simple http only config', () => {
    const config: Config = {
      outgoingSmtp: { host: 'localhost', port: 1234 },
      httpServices: [{ port: 8080 }],
    };
    const result = ConfigSchema.parse(config);
    expect(result).toMatchObject<Config>(config);
  });

  it('duplicated http service port will fail', () => {
    const t = () => {
      const config: Config = {
        outgoingSmtp: { host: 'localhost', port: 1234 },
        httpServices: [{ port: 8080 }, { port: 8080 }],
      };
      ConfigSchema.parse(config);
    };
    expect(t).toThrow(ZodError);
  });

  it('simple basic auth', () => {
    const config: Config = {
      outgoingSmtp: { host: 'localhost', port: 1234 },
      httpServices: [{
        port: 8080,
        auth: {
          type: 'basic',
          username: 'username',
          password: 'password'
        }
      }],
    };
    ConfigSchema.parse(config);
  });

  it('basic auth without all required fields', () => {
    const t = () => {
      const config = {
        outgoingSmtp: { host: 'localhost', port: 1234 },
        httpServices: [{
          port: 8080,
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

  it('simple custom auth', () => {
    const config: Config = {
      outgoingSmtp: { host: 'localhost', port: 1234 },
      httpServices: [{
        port: 8080,
        auth: {
          type: 'custom'
        }
      }],
    };
    ConfigSchema.parse(config);
  });
});
