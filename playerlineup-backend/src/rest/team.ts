import * as teamService from '../service/team';
import Router from '@koa/router';
import type { PlayerLineupContext, PlayerLineupState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  CreateTeamRequest,
  CreateTeamResponse,
  GetAllTeamsResponse,
  GetTeamByIdResponse,
  AddPlayerToTeamRequest,
  RemovePlayerFromTeamRequest,
  UpdateTeamResponse,
  UpdateTeamNameRequest,
  UpdateTeamNameResponse,
} from '../types/team';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @api {get} /teams Get All Teams
 * @apiName GetAllTeams
 * @apiGroup Teams
 * 
 * @apiDescription Retrieves a list of all teams the user has access to.
 * 
 * @apiSuccess {Object[]} items List of teams.
 * @apiSuccess {Number} items.id ID of the team.
 * @apiSuccess {String} items.name Name of the team.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "items": [
 *     { "id": 1, "name": "Lakers" },
 *     { "id": 2, "name": "Warriors" }
 *   ]
 * }
 */
const getAllTeams = async (ctx: KoaContext<GetAllTeamsResponse>) => {
  const userId = ctx.state.session.userId;
  const roles = ctx.state.session.roles;
  const teams = await teamService.getAllTeams(userId, roles);

  ctx.body = {
    items: teams,
  };
};
getAllTeams.validationScheme = null;

/**
 * @api {get} /teams/:id Get Team by ID
 * @apiName GetTeamById
 * @apiGroup Teams
 * 
 * @apiDescription Retrieves details of a specific team by its ID.
 * 
 * @apiParam {Number} id The ID of the team.
 * 
 * @apiSuccess {Number} id ID of the team.
 * @apiSuccess {String} name Name of the team.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "Lakers"
 * }
 * 
 * @apiError NotFound The team does not exist.
 */
const getTeamById = async (ctx: KoaContext<GetTeamByIdResponse, IdParams>) => {
  const userId = ctx.state.session.userId;
  const roles = ctx.state.session.roles;
  const teamId = Number(ctx.params.id);
  const team = await teamService.getTeamById(teamId, userId, roles);

  ctx.body = team;
};
getTeamById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {post} /teams Create a Team
 * @apiName CreateTeam
 * @apiGroup Teams
 * 
 * @apiDescription Creates a new team.
 * 
 * @apiBody {String} name The name of the team.
 * 
 * @apiSuccess {Number} id The ID of the created team.
 * @apiSuccess {String} name The name of the created team.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 3,
 *   "name": "Clippers"
 * }
 */
const createTeam = async (ctx: KoaContext<CreateTeamResponse, void, CreateTeamRequest>) => {
  const userId = ctx.state.session.userId;
  const team = await teamService.createTeam(ctx.request.body, userId);

  ctx.status = 201;
  ctx.body = team;
};
createTeam.validationScheme = {
  body: {
    name: Joi.string().required(),
  },
};

/**
 * @api {put} /teams/:id Update Team Name
 * @apiName UpdateTeamName
 * @apiGroup Teams
 * 
 * @apiDescription Updates the name of a specific team.
 * 
 * @apiParam {Number} id The ID of the team.
 * 
 * @apiBody {String} name The new name of the team.
 * 
 * @apiSuccess {Number} id The ID of the updated team.
 * @apiSuccess {String} name The updated name of the team.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "New Lakers"
 * }
 */
const updateTeamName = async (ctx: KoaContext<UpdateTeamNameResponse, IdParams, UpdateTeamNameRequest>) => {
  const userId = ctx.state.session.userId;
  const teamId = Number(ctx.params.id);
  const newTeamName = ctx.request.body.name;

  const team = await teamService.updateTeamNameById(teamId, userId, newTeamName);

  ctx.body = team;
};
updateTeamName.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    name: Joi.string().required(),
  },
};

/**
 * @api {put} /teams/:id/players Add Player to Team
 * @apiName AddPlayerToTeam
 * @apiGroup Teams
 * 
 * @apiDescription Adds a player to a specific team.
 * 
 * @apiParam {Number} id The ID of the team.
 * 
 * @apiBody {Number} player_id The ID of the player to add.
 * 
 * @apiSuccess {Number} id The ID of the team.
 * @apiSuccess {String} name The name of the team.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "Lakers"
 * }
 */
const addPlayerToTeam = async (ctx: KoaContext<UpdateTeamResponse, IdParams, AddPlayerToTeamRequest>) => {
  const userId = ctx.state.session.userId;
  const playerId = Number(ctx.request.body.player_id);
  const teamId = Number(ctx.params.id);

  const team = await teamService.addPlayerToTeam(teamId, playerId, userId);

  ctx.body = team;
};
addPlayerToTeam.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    player_id: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {delete} /teams/:id/players/:playerId Remove Player from Team
 * @apiName RemovePlayerFromTeam
 * @apiGroup Teams
 * 
 * @apiDescription Removes a player from a specific team.
 * 
 * @apiParam {Number} id The ID of the team.
 * @apiParam {Number} playerId The ID of the player to remove.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 */
const removePlayerFromTeam = async (ctx: KoaContext<UpdateTeamResponse, IdParams, RemovePlayerFromTeamRequest>) => {
  const userId = ctx.state.session.userId;
  const playerId = Number(ctx.params.playerId);
  const teamId = Number(ctx.params.id);

  const team = await teamService.removePlayerFromTeam(teamId, playerId, userId);

  ctx.body = team;
};
removePlayerFromTeam.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
    playerId: Joi.number().integer().positive().required(),
  },
};

/**
 * @api {delete} /teams/:id Delete Team
 * @apiName DeleteTeam
 * @apiGroup Teams
 * 
 * @apiDescription Deletes a specific team by ID.
 * 
 * @apiParam {Number} id The ID of the team.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 */
const deleteTeam = async (ctx: KoaContext<void, IdParams>) => {
  const userId = ctx.state.session.userId;
  const teamId = Number(ctx.params.id);

  await teamService.deleteTeamById(teamId, userId);

  ctx.status = 204;
};
deleteTeam.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

// routes
export default (parent: KoaRouter) => {
  const router = new Router<PlayerLineupState, PlayerLineupContext>({
    prefix: '/teams',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllTeams.validationScheme), getAllTeams);
  router.get('/:id', validate(getTeamById.validationScheme), getTeamById);
  router.post('/', validate(createTeam.validationScheme), createTeam);
  router.put('/:id', validate(updateTeamName.validationScheme), updateTeamName);
  router.put('/:id/players', validate(addPlayerToTeam.validationScheme), addPlayerToTeam);
  router.delete('/:id/players/:playerId', validate(removePlayerFromTeam.validationScheme), removePlayerFromTeam);
  router.delete('/:id', validate(deleteTeam.validationScheme), deleteTeam);

  parent.use(router.routes()).use(router.allowedMethods());
};
