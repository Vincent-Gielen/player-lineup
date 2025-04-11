import * as userService from '../service/user';
import Router from '@koa/router';
import type { PlayerLineupContext, PlayerLineupState } from '../types/koa';
import type { KoaContext, KoaRouter } from '../types/koa';
import type {
  RegisterRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  GetUserRequest,
  UpdateUserRequest,
  UpdateUserResponse,
  LoginResponse,
} from '../types/user';
import type { IdParams } from '../types/common';
import validate from '../core/validation';
import Joi from 'joi';
import { requireAuthentication, makeRequireRole, authDelay } from '../core/auth';
import Role from '../core/roles';
import type { Next } from 'koa';

/**
 * @api {get} /users/:id Check User Information
 * @apiName GetUser
 * @apiGroup Users
 * @apiDescription Retrieves information about a specific user. A user can only view their own data unless they are an admin.
 * 
 * @apiParam {String} id The ID of the user to retrieve. Use "me" to refer to the authenticated user.
 * 
 * @apiSuccess {Number} id User's unique ID.
 * @apiSuccess {String} name User's full name.
 * @apiSuccess {String} email User's email address.
 * 
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "id": 123,
 *    "name": "Thomas Aelbecht",
 *    "email": "thomas.aelbrecht@hogent.be"
 *  }
 * 
 * 
 * @apiError (403) {String} Forbidden You are not allowed to view this user's information.

 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 403 Forbidden
 *  {
 *    "code": "FORBIDDEN",
 *    "message": "You are not allowed to view this user's information"
 *  }
 */

const checkUserId = (ctx: KoaContext<unknown, GetUserRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get your own data unless you're an admin
  if (id !== 'me' && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      'You are not allowed to view this user\'s information',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

/**
 * @api {get} /users Get All Users
 * @apiName GetAllUsers
 * @apiGroup Users
 * 
 * @apiDescription Retrieves a list of all users. Only accessible by admins.
 * 
 * @apiSuccess {Object[]} items List of users.
 * @apiSuccess {Number} items.id ID of the user.
 * @apiSuccess {String} items.name Name of the user.
 * @apiSuccess {String} items.email Email address of the user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "items": [
 *     { "id": 1, "name": "John Doe", "email": "john@example.com" },
 *     { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
 *   ]
 * }
 */
const getAllUsers = async (ctx: KoaContext<GetAllUsersResponse>) => {
  const users = await userService.getAll();
  ctx.body = { items: users };
};
getAllUsers.validationScheme = null;

/**
 * @api {get} /users/:id Get User by ID
 * @apiName GetUserById
 * @apiGroup Users
 * 
 * @apiDescription Retrieves information about a specific user by their ID. Use `me` as the ID to retrieve the current user's information.
 * 
 * @apiParam {Number|String} id The ID of the user or "me".
 * 
 * @apiSuccess {Number} id ID of the user.
 * @apiSuccess {String} name Name of the user.
 * @apiSuccess {String} email Email address of the user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 * 
 * @apiError Forbidden You are not authorized to access this user's information.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *   "error": "You are not allowed to view this user's information"
 * }
 */
const getUserById = async (ctx: KoaContext<GetUserByIdResponse, GetUserRequest>) => {
  const user = await userService.getById(
    ctx.params.id === 'me' ? ctx.state.session.userId : ctx.params.id,
  );

  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().valid('me'),
    ),
  },
};

/**
 * @api {post} /users Register a New User
 * @apiName RegisterUser
 * @apiGroup Users
 * 
 * @apiDescription Registers a new user and returns a JWT token for authentication.
 * 
 * @apiBody {String} name Name of the user.
 * @apiBody {String} email Email address of the user.
 * @apiBody {String} password Password for the user (minimum 12 characters).
 * 
 * @apiSuccess {String} token JWT token for the newly registered user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * @apiError BadRequest Invalid registration details.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "Invalid registration details"
 * }
 */
const registerUser = async (ctx: KoaContext<LoginResponse, never, RegisterRequest>) => {
  const token = await userService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = {
    token,
  };
};
registerUser.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(12).max(128),
  },
};

/**
 * @api {put} /users/:id Update User by ID
 * @apiName UpdateUser
 * @apiGroup Users
 * 
 * @apiDescription Updates the information of a specific user by their ID.
 * 
 * @apiParam {Number} id The ID of the user.
 * 
 * @apiBody {String} [name] The new name of the user.
 * @apiBody {String} [email] The new email address of the user.
 * 
 * @apiSuccess {Number} id The ID of the updated user.
 * @apiSuccess {String} name The updated name of the user.
 * @apiSuccess {String} email The updated email address of the user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "Updated Name",
 *   "email": "updated@example.com"
 * }
 */
const updateUserById = async (ctx: KoaContext<UpdateUserResponse, IdParams, UpdateUserRequest>) => {
  const user = await userService.updateById(Number(ctx.params.id), ctx.request.body);
  ctx.status = 200;
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string().max(255).optional(),
    email: Joi.string().email().optional(),
  },
};

/**
 * @api {delete} /users/:id Delete User by ID
 * @apiName DeleteUser
 * @apiGroup Users
 * 
 * @apiDescription Deletes a user by their ID.
 * 
 * @apiParam {Number} id The ID of the user.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 */
const deleteUserById = async (ctx: KoaContext<void, IdParams>) => {
  await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

// routes
export default (parent: KoaRouter) => {
  const router = new Router<PlayerLineupState, PlayerLineupContext>({
    prefix: '/users',
  });

  router.post('/', authDelay, validate(registerUser.validationScheme), registerUser);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/',
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers);

  router.get('/:id',
    requireAuthentication,
    validate(getUserById.validationScheme),
    checkUserId,
    getUserById);

  router.put('/:id',
    requireAuthentication,
    validate(updateUserById.validationScheme),
    checkUserId,
    updateUserById);
      
  router.delete('/:id',
    requireAuthentication,
    validate(deleteUserById.validationScheme),
    checkUserId,
    deleteUserById);

  parent.use(router.routes()).use(router.allowedMethods());
};
