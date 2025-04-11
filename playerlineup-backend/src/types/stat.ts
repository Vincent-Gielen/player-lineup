import type { Entity, ListResponse } from './common';

export interface Stat extends Entity {
  player_id: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  turnovers: number;
}

export interface StatCreateInput {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  turnovers: number;
}

export interface CreateStatRequest extends StatCreateInput {}
export interface UpdateStatRequest {
  points?: number;
  rebounds?: number;
  assists?: number;
  steals?: number;
  turnovers?: number;
}

export interface StatUpdateInput extends UpdateStatRequest {}

export interface GetPlayerStatsResponse extends ListResponse<Stat> {}
export interface GetStatByIdResponse extends Stat {}
export interface CreateStatResponse extends GetStatByIdResponse {}
export interface UpdateStatResponse extends GetStatByIdResponse {}
