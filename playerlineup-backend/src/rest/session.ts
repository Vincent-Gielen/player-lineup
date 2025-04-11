import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as userService from '../service/user';
import type {
  KoaContext,
  KoaRouter,
  PlayerLineupContext,
  PlayerLineupState,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/user';
import { authDelay } from '../core/auth';

/**
 * @api {post} /sessions Login
 * @apiName Login
 * @apiGroup Session
 * 
 * @apiDescription Authenticates a user and returns a JWT token for session management.
 * 
 * @apiBody {String} email The user's email address.
 * @apiBody {String} password The user's password.
 * 
 * @apiSuccess {String} token A JWT token for authentication.
 * 
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * @apiError BadRequest The provided email or password is invalid.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "Invalid email or password"
 * }
 * 
 * @apiError Unauthorized The user could not be authenticated.
 * 
 * @apiErrorExample Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *   "error": "Unauthorized"
 * }
 */
const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { email, password } = ctx.request.body;
  const token = await userService.login(email, password);

  ctx.status = 200;
  ctx.body = { token };
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<PlayerLineupState, PlayerLineupContext>({
    prefix: '/sessions',
  });

  router.post('/', authDelay, validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}
