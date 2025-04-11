import * as statService from '../service/stat';
import Router from '@koa/router';
import type { PlayerLineupContext, PlayerLineupState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateStatRequest,
  CreateStatResponse,
  GetStatByIdResponse,
  UpdateStatRequest,
  UpdateStatResponse,
} from '../types/stat';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /players/:playerId/stats/:id Get Stat by ID
 * @apiName GetStatById
 * @apiGroup Stats
 * 
 * @apiParam {Number} playerId The ID of the player.
 * @apiParam {Number} id The ID of the stat.
 * 
 * @apiSuccess {Number} id The ID of the stat.
 * @apiSuccess {Number} playerId The ID of the associated player.
 * @apiSuccess {Number} points The number of points scored.
 * @apiSuccess {Number} rebounds The number of rebounds.
 * @apiSuccess {Number} assists The number of assists.
 * @apiSuccess {Number} steals The number of steals.
 * @apiSuccess {Number} turnovers The number of turnovers.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "playerId": 23,
 *   "points": 30,
 *   "rebounds": 10,
 *   "assists": 5,
 *   "steals": 2,
 *   "turnovers": 1
 * }
 * 
 * @apiError NotFound The stat or player does not exist.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Stat not found"
 * }
 */
const getStatById = async (ctx: KoaContext<GetStatByIdResponse, IdParams>) => {
  const playerId = Number(ctx.params.playerId);
  const statId = Number(ctx.params.id);
  const userId = Number(ctx.state.session.userId);

  const stat = await statService.getStatById(playerId, statId, userId);

  ctx.body = stat;
};
getStatById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
    playerId: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {post} /players/:playerId/stats Create a Stat
 * @apiName CreateStat
 * @apiGroup Stats
 * 
 * @apiParam {Number} playerId The ID of the player.
 * 
 * @apiBody {Number} points The number of points scored.
 * @apiBody {Number} rebounds The number of rebounds.
 * @apiBody {Number} assists The number of assists.
 * @apiBody {Number} steals The number of steals.
 * @apiBody {Number} turnovers The number of turnovers.
 * 
 * @apiSuccess {Number} id The ID of the created stat.
 * @apiSuccess {Number} playerId The ID of the associated player.
 * @apiSuccess {Number} points The number of points scored.
 * @apiSuccess {Number} rebounds The number of rebounds.
 * @apiSuccess {Number} assists The number of assists.
 * @apiSuccess {Number} steals The number of steals.
 * @apiSuccess {Number} turnovers The number of turnovers.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 5,
 *   "playerId": 23,
 *   "points": 25,
 *   "rebounds": 8,
 *   "assists": 7,
 *   "steals": 1,
 *   "turnovers": 3
 * }
 * 
 * @apiError BadRequest The request body contains invalid data.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "Invalid stat data"
 * }
 */
const createStat = async (ctx: KoaContext<CreateStatResponse, IdParams, CreateStatRequest>) => {
  const userId = ctx.state.session.userId;
  const playerId = Number(ctx.params.playerId);

  const stat = await statService.createStat(playerId, ctx.request.body, userId);

  ctx.status = 201;
  ctx.body = stat;
};
createStat.validationScheme = {
  session: {
    userId: Joi.number().integer().positive().required(),
  },
  params: {
    playerId: Joi.number().integer().positive().required(),
  },
  body: {
    points: Joi.number().integer().min(0).required(),
    rebounds: Joi.number().integer().min(0).required(),
    assists: Joi.number().integer().min(0).required(),
    steals: Joi.number().integer().min(0).required(),
    turnovers: Joi.number().integer().min(0).required(),
  },
};

/**
 * @api {put} /players/:playerId/stats/:id Update a Stat
 * @apiName UpdateStat
 * @apiGroup Stats
 * 
 * @apiParam {Number} playerId The ID of the player.
 * @apiParam {Number} id The ID of the stat.
 * 
 * @apiBody {Number} [points] The number of points scored.
 * @apiBody {Number} [rebounds] The number of rebounds.
 * @apiBody {Number} [assists] The number of assists.
 * @apiBody {Number} [steals] The number of steals.
 * @apiBody {Number} [turnovers] The number of turnovers.
 * 
 * @apiSuccess {Number} id The ID of the updated stat.
 * @apiSuccess {Number} playerId The ID of the associated player.
 * @apiSuccess {Number} points The updated number of points scored.
 * @apiSuccess {Number} rebounds The updated number of rebounds.
 * @apiSuccess {Number} assists The updated number of assists.
 * @apiSuccess {Number} steals The updated number of steals.
 * @apiSuccess {Number} turnovers The updated number of turnovers.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "playerId": 23,
 *   "points": 35,
 *   "rebounds": 12,
 *   "assists": 9,
 *   "steals": 3,
 *   "turnovers": 2
 * }
 * 
 * @apiError BadRequest The request body contains invalid data.
 * 
 * @apiError NotFound The stat or player does not exist.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "Invalid stat update data"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Stat not found"
 * }
 */
const updateStat = async (ctx: KoaContext<UpdateStatResponse, IdParams, UpdateStatRequest>) => {
  const userId = Number(ctx.state.session.userId);
  const playerId = Number(ctx.params.playerId);
  const statId = Number(ctx.params.id);

  const stat = await statService.updateStatById(playerId, statId, ctx.request.body, userId);

  ctx.body = stat;
};
updateStat.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
    playerId: Joi.number().integer().positive().required(),
  },
  body: {
    points: Joi.number().integer().min(0).optional(),
    rebounds: Joi.number().integer().min(0).optional(),
    assists: Joi.number().integer().min(0).optional(),
    steals: Joi.number().integer().min(0).optional(),
    turnovers: Joi.number().integer().min(0).optional(),
  },
};

/**
 * @api {delete} /players/:playerId/stats/:id Delete a Stat
 * @apiName DeleteStat
 * @apiGroup Stats
 * 
 * @apiParam {Number} playerId The ID of the player.
 * @apiParam {Number} id The ID of the stat.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 * 
 * @apiError NotFound The stat or player does not exist.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Stat not found"
 * }
 */
const deleteStat = async (ctx: KoaContext<void, IdParams>) => {
  const playerId = Number(ctx.params.playerId);
  const userId = Number(ctx.state.session.userId);
  const statId = Number(ctx.params.id);

  await statService.deleteStatById(playerId, statId, userId);

  ctx.status = 204;
};
deleteStat.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
    playerId: Joi.number().integer().positive().required(),
  },
};

//routes
export default (parent: KoaRouter) => {
  const router = new Router<PlayerLineupState, PlayerLineupContext>({
    prefix: '/players/:playerId/stats',
  });

  router.use(requireAuthentication);

  router.get('/:id', validate(getStatById.validationScheme), getStatById);
  router.post('/', validate(createStat.validationScheme), createStat);
  router.put('/:id', validate(updateStat.validationScheme), updateStat);
  router.delete('/:id', validate(deleteStat.validationScheme), deleteStat);

  parent.use(router.routes()).use(router.allowedMethods());
};
