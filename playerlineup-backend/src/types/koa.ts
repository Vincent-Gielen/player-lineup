// src/types/koa.ts
import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import type { SessionInfo } from './auth';

export interface PlayerLineupState {
  session: SessionInfo;
}

export interface PlayerLineupContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  PlayerLineupState,
  PlayerLineupContext<Params, RequestBody, Query>,
  ResponseBody>;

export interface KoaApplication
  extends Application<PlayerLineupState, PlayerLineupContext> {}

export interface KoaRouter extends Router<PlayerLineupState, PlayerLineupContext> {}
