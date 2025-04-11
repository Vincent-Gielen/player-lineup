import type { Entity, ListResponse } from './common';

export interface Player extends Entity {
  name: string;
  position: string;
}

export interface PlayerCreateInput {
  name: string;
  position: string;
}

export interface PlayerUpdateInput extends PlayerCreateInput {}

export interface CreatePlayerRequest extends PlayerCreateInput {}
export interface UpdatePlayerRequest extends PlayerUpdateInput {}

export interface GetAllPlayersResponse extends ListResponse<Player> {}
export interface GetPlayerByIdResponse extends Player {}
export interface CreatePlayerResponse extends GetPlayerByIdResponse {}
export interface UpdatePlayerResponse extends GetPlayerByIdResponse {}
