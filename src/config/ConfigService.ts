import { readFileSync } from 'fs';
import { Config, ConfigSchema } from './config.model';

export class ConfigService {
  private config: Config;

  constructor(configFilePath: string) {
    const configFileContent = readFileSync(configFilePath, { encoding: 'utf8' });
    const configResult = ConfigSchema.safeParse(JSON.parse(configFileContent.toString()));

    if (configResult.success) {
      this.config = configResult.data;
    } else {
      throw new Error(`Error while parsing config: ${JSON.stringify(configResult.error.errors)}`);
    }
  }

  getConfig(): Config {
    return this.config;
  }
}
