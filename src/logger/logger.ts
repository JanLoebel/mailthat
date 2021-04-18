import { Logger as TsLogger, TLogLevelName } from 'tslog';

export default new TsLogger({
  maskValuesOfKeys: ['secret', 'pwd', 'password', 'key', 'token', 'accesstoken'],
  minLevel: process.env.LOG_LEVEL as TLogLevelName || 'debug',
});
