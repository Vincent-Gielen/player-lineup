import type { Stat, StatCreateInput, StatUpdateInput } from '../types/stat';
import { prisma } from '../data';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';
import * as playerService from './player';

// Get a stat for a player by player ID and stat ID
export const getStatById = async (player_id: number, id: number, user_id: number): Promise<Stat> => {
  await playerService.checkUserHasPlayer(player_id, user_id);

  const stat = await prisma.stat.findUnique({
    where: {
      id,
      player_id,
    },
  });
  if (!stat) {
    throw ServiceError.notFound('No stat with this id exists');
  }
  return stat;
};

// Create a stat for a player by player ID
export const createStat = async (player_id: number, stat: StatCreateInput, user_id: number): Promise<Stat> => {

  try {
    await playerService.checkUserHasPlayer(player_id, user_id);

    return await prisma.stat.create({
      data: {
        ...stat,
        player_id,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

// Update a stat for a player by player ID and stat ID
export const updateStatById = async (
  player_id: number, id: number, changes: StatUpdateInput, user_id: number): Promise<Stat> => {
  
  try {
    await playerService.checkUserHasPlayer(player_id, user_id);
    await checkStatExists(player_id, id);

    return await prisma.stat.update({
      where: {
        id,
        player_id,
      },
      data: changes,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

// Delete a stat for a player by player ID and stat ID
export const deleteStatById = async (player_id: number, id: number, user_id: number): Promise<void> => {
  try {
    await playerService.checkUserHasPlayer(player_id, user_id);
    await checkStatExists(player_id, id);

    await prisma.stat.delete({
      where: {
        player_id,
        id,
      },
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const checkStatExists = async (player_id: number, stat_id: number): Promise<void> => {
  const stat = await prisma.stat.findUnique({
    where: {
      player_id,
      id: stat_id,
    },
  });
  if (!stat) {
    throw ServiceError.notFound('No stat with this id exists');
  }
};
