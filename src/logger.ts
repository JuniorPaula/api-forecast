// eslint-disable-next-line @typescript-eslint/no-var-requires
const pino = require('pino');
import config from 'config';

export default pino({
  enabled: config.get('App.logger.enabled'),
  level: config.get('App.logger.level'),
});
