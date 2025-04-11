import Router from '@koa/router';
import installPlayersRouter from './player';
import installHealthRouter from './health';
import installUsersRouter from './user';
import installTeamsRouter from './team';
import installStatsRouter from './stat';
import type { PlayerLineupState, PlayerLineupContext, KoaApplication } from '../types/koa';
import installSessionRouter from './session';

/**
 * @apiDefine BaseAPI
 * 
 * This is the base API that groups all routes, such as players, users, teams, stats, health and sessions.
 * 
 * @apiBasePath /api
 * 
 * Each route is prefixed with `/api` to provide a consistent namespace for the application's endpoints.
 */
export default (app: KoaApplication) => {
  const router = new Router<PlayerLineupState, PlayerLineupContext>({
    prefix: '/api',
  });

  /**
   * @apiGroup Players
   * @apiDescription Endpoints for managing players, such as creating, retrieving, updating, and deleting player data.
   */
  installPlayersRouter(router);

  /**
   * @apiGroup Health
   * @apiDescription Health check endpoints, including ping and version information.
   */
  installHealthRouter(router);

  /**
   * @apiGroup Users
   * @apiDescription User management endpoints, such as authentication and profile updates.
   */
  installUsersRouter(router);

  /**
   * @apiGroup Teams
   * @apiDescription Endpoints for managing teams, including creation and retrieval of team data.
   */
  installTeamsRouter(router);

  /**
   * @apiGroup Stats
   * @apiDescription Endpoints for managing statistics, such as player and team stats.
   */
  installStatsRouter(router);

  /**
   * @apiGroup Session
   * @apiDescription Session management endpoints, such as login and logout functionality.
   */
  installSessionRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
