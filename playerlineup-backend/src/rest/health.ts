import Router from '@koa/router';
import * as healthService from '../service/health';
import type { PlayerLineupContext, PlayerLineupState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type { PingResponse, VersionResponse } from '../types/health';
import validate from '../core/validation';

/**
 * @api {get} /health/ping Health Check: Ping
 * @apiName Ping
 * @apiGroup Health
 * 
 * @apiSuccess {String} message A "pong" message indicating the service is running.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "pong"
 * }
 */
const ping = async (ctx: KoaContext<PingResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

/**
 * @api {get} /health/version Get API Version
 * @apiName GetVersion
 * @apiGroup Health
 * 
 * @apiSuccess {String} version The current version of the API.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "version": "1.0.0"
 * }
 */
const getVersion = async (ctx: KoaContext<VersionResponse>) => {
  ctx.status = 200;
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;

export default function installPlacesRoutes(parent: KoaRouter) {
  const router = new Router<PlayerLineupState, PlayerLineupContext>({ prefix: '/health' });

  router.get('/ping', validate(ping.validationScheme), ping);
  router.get('/version', validate(getVersion.validationScheme), getVersion);

  parent
    .use(router.routes())
    .use(router.allowedMethods());
};
