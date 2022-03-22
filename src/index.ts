import { SetupServer } from './server';
import config from 'config';
import logger from './logger';

enum exitedStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `App exiting due to unhandled promise: ${promise} and reason ${reason}`
  );

  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`App exiting due to uncaught exception: ${error}`);
  process.exit(exitedStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();

    const exitedSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    exitedSignals.map((sig) =>
      process.on(sig, async () => {
        try {
          await server.close();
          logger.info(`App exited with success!`);
          process.exit(exitedStatus.Success);
        } catch (error) {
          logger.error(`App exited with ${error}`);
          process.exit(exitedStatus.Failure);
        }
      })
    );
  } catch (error) {
    logger.error(`App exited with error ${error}`);
    process.exit(exitedStatus.Failure);
  }
})();
