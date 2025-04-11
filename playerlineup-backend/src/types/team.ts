import type { Entity, ListResponse } from './common';

export interface Team extends Entity {
  name: string;
}

export interface TeamCreateInput {
  name: string;
}

export interface TeamUpdateNameInput {
  name: string;
}

export interface TeamUpdatePlayerInput {
  player_id: number;
}

export interface CreateTeamRequest extends TeamCreateInput {}
export interface UpdateTeamNameRequest extends TeamUpdateNameInput {}
export interface AddPlayerToTeamRequest extends TeamUpdatePlayerInput {}
export interface RemovePlayerFromTeamRequest extends TeamUpdatePlayerInput {}

export interface GetAllTeamsResponse extends ListResponse<Team> {}
export interface GetTeamByIdResponse extends Team {}
export interface CreateTeamResponse extends GetTeamByIdResponse {}
export interface UpdateTeamResponse extends GetTeamByIdResponse {}
export interface UpdateTeamNameResponse extends GetTeamByIdResponse {}
