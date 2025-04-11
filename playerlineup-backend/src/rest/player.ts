import * as playerService from '../service/player';
import Router from '@koa/router';
import type { PlayerLineupContext, PlayerLineupState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreatePlayerRequest,
  CreatePlayerResponse,
  GetAllPlayersResponse,
  GetPlayerByIdResponse,
  UpdatePlayerRequest,
  UpdatePlayerResponse,
} from '../types/player';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /players Get all players
 * @apiName GetAllPlayers
 * @apiGroup Players
 * 
 * @apiSuccess {Object[]} items List of players.
 * @apiSuccess {Number} items.id ID of the player.
 * @apiSuccess {String} items.name Name of the player.
 * @apiSuccess {String} items.position Position of the player.
 * @apiSuccess {Number} items.user_id ID of the associated user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "items": [
 *   {
 *   "id": 1,
 *   "name": "Kobe Bryant",
 *   "position": "Shooting Guard",
 *   "user_id": 1
 *   },
 *   {
 *   "id": 2,
 *   "name": "LeBron James",
 *   "position": "Small Forward",
 *   "user_id": 1
 *   }
 *  ]
 * }
 * 
 * @apiError Unauthorized The user is not authenticated.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 * "error": "Unauthorized"
 * }
 */
const getAllPlayers = async (ctx: KoaContext<GetAllPlayersResponse>) => {
  const players = await playerService.getAllPlayers();

  ctx.body = {
    items: players,
  };
};
getAllPlayers.validationScheme = null;

/**
 * @api {get} /players/:id Get player by ID
 * @apiName GetPlayerById
 * @apiGroup Players
 * 
 * @apiParam {Number} id The player's unique ID.
 * 
 * @apiSuccess {Number} id ID of the player.
 * @apiSuccess {String} name Name of the player.
 * @apiSuccess {String} position Position of the player.
 * @apiSuccess {Number} user_id ID of the associated user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "Kobe Bryant",
 *   "position": "Small Forward",
 *   "user_id": 1
 * }
 * 
 * @apiError NotFound The player with the specified ID does not exist.
 * 
 * @apiError Unauthorized The user is not authenticated.
 * 
 * @apiError BadRequest Invalid ID format.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 * "error": "Invalid ID"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 * "error": "Player not found"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 * "error": "Unauthorized"
 * }
 */
const getPlayerById = async (ctx: KoaContext<GetPlayerByIdResponse, IdParams>) => {
  const playerId = Number(ctx.params.id);
  const player = await playerService.getPlayerById(playerId);
  
  ctx.body = player;
};
getPlayerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @api {post} /players Create a new player
 * @apiName CreatePlayer
 * @apiGroup Players
 * 
 * @apiBody {String} name Name of the player.
 * @apiBody {String="Point Guard","Shooting Guard","Small Forward","Power Forward","Center"} position Position of the player.
 * 
 * @apiSuccess {Number} id ID of the created player.
 * @apiSuccess {String} name Name of the created player.
 * @apiSuccess {String} position Position of the created player.
 * @apiSuccess {Number} user_id ID of the associated user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 3,
 *   "name": "Kevin Durant",
 *   "position": "Small Forward",
 *   "user_id": 1
 * }
 * 
 * @apiError BadRequest Validation failed for request body.
 * 
 * @apiError Unauthorized The user is not authenticated.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 * "error": "Invalid player data"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 * "error": "Unauthorized"
 * }
 */
const createPlayer = async (ctx: KoaContext<CreatePlayerResponse, void, CreatePlayerRequest>) => {
  const userId = ctx.state.session.userId;
  const player = await playerService.createPlayer(ctx.request.body, userId);

  ctx.status = 201;
  ctx.body = player;
};
createPlayer.validationScheme = {
  session: {
    userId: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string(),
    position: Joi.string().equal('Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'),
  },
};

/**
 * @api {put} /players/:id Update a player's details
 * @apiName UpdatePlayer
 * @apiGroup Players
 * 
 * @apiParam {Number} id The player's unique ID.
 * 
 * @apiBody {String} [name] Name of the player.
 * @apiBody {String="Point Guard","Shooting Guard","Small Forward","Power Forward","Center"} [position] Position of the player.
 * 
 * @apiSuccess {Number} id ID of the updated player.
 * @apiSuccess {String} name Updated name of the player.
 * @apiSuccess {String} position Updated position of the player.
 * @apiSuccess {Number} user_id ID of the associated user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "Kobe Bryant",
 *   "position": "Power Forward",
 *   "user_id": 1
 * }
 * 
 * @apiError BadRequest Validation failed for request body or invalid ID format.
 * 
 * @apiError Unauthorized The user is not authenticated.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 * "error": "Invalid update data"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 * "error": "Unauthorized"
 * }
 */
const updatePlayer = async (ctx: KoaContext<UpdatePlayerResponse, IdParams, UpdatePlayerRequest>) => {
  const userId = ctx.state.session.userId;
  const playerId = Number(ctx.params.id);
  const player = await playerService.updatePlayerDetailsById(playerId, userId, ctx.request.body);

  ctx.body = player;
};
updatePlayer.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  session: {
    user_id: Joi.number().integer().positive().required(),
  },
  body: {
    name: Joi.string().optional(),
    position: Joi.string().equal(
      'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center').optional(),  
  },
};

/**
 * @api {delete} /players/:id Delete a player
 * @apiName DeletePlayer
 * @apiGroup Players
 * 
 * @apiParam {Number} id The player's unique ID.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 * 
 * @apiError NotFound The player with the specified ID does not exist.
 * 
 * @apiError Unauthorized The user is not authenticated.
 * 
 * @apiError BadRequest Invalid ID format.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 * "error": "Invalid ID"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 * "error": "Player not found"
 * }
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 * "error": "Unauthorized"
 * }
 */
const deletePlayer = async (ctx: KoaContext<void, IdParams>) => {
  const userId = ctx.state.session.userId;
  const playerId = Number(ctx.params.id);
  await playerService.deletePlayerById(playerId, userId);
  
  ctx.status = 204;
};
deletePlayer.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

// routes
export default(parent: KoaRouter) => {
  const router = new Router<PlayerLineupState, PlayerLineupContext>({
    prefix: '/players',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllPlayers.validationScheme), getAllPlayers);
  router.get('/:id', validate(getPlayerById.validationScheme), getPlayerById);
  router.post('/', validate(createPlayer.validationScheme), createPlayer);
  router.put('/:id', validate(updatePlayer.validationScheme), updatePlayer);
  router.delete('/:id', validate(deletePlayer.validationScheme), deletePlayer);
  
  // De players router hangen onder parent
  parent.use(router.routes()) //effectieve routing
    .use(router.allowedMethods()); //HTTP 405
  
};
