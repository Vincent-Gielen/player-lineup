import Koa from 'koa';
import config from 'config';
import { getLogger } from './core/logging';
import installRest from './rest';
import { initializeData, shutdownData } from './data';
import type { KoaApplication, PlayerLineupContext, PlayerLineupState } from './types/koa';
import installMiddlewares from './core/installMiddlewares';

const PORT = config.get<number>('port');

export interface Server {
  getApp(): KoaApplication;
  start(): Promise<void>;
  stop(): Promise<void>;
}

//FACTORY 
export default async function createServer(): Promise<Server> {
  const app = new Koa<PlayerLineupState, PlayerLineupContext>();

  installMiddlewares(app);
  await initializeData();
  installRest(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise(
        (resolve) => {
          app.listen(PORT, () => {
            getLogger().info(`🚀 Server listening on http://localhost:${PORT}`);
            resolve();
          });
        });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Goodbye!');
    },
  };
}

